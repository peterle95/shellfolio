"use client";

import * as THREE from 'three'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame, type ThreeElement } from '@react-three/fiber'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody, type RigidBodyProps } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'

declare module '@react-three/fiber' {
    interface ThreeElements {
        meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
        meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
    }
}

interface BadgeProps {
    onReady: () => void
    onFailure: () => void
}

interface BandProps extends BadgeProps {
    maxSpeed?: number
    minSpeed?: number
    setInteractive: (interactive: boolean) => void
    visible: boolean
}

type SmoothedRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 }
type CaptureTarget = EventTarget & Pick<Element, 'setPointerCapture' | 'hasPointerCapture' | 'releasePointerCapture'>
type BadgeModel = ReturnType<typeof useGLTF<string>> & {
    nodes: { card: THREE.Mesh; clip: THREE.Mesh; clamp: THREE.Mesh }
    materials: { metal: THREE.MeshStandardMaterial }
}

function configureProfileTexture(texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.repeat.set(2, 2)
    texture.offset.set(-0.1, -0.3)
}

function configureBandTexture(texture: THREE.Texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
}

extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/models/tag.glb')
useTexture.preload('/images/band.jpg')

export default function Badge({ onReady, onFailure }: BadgeProps) {
    const [interactive, setInteractive] = useState(false)
    const [visible, setVisible] = useState(() => !document.hidden)
    useEffect(() => {
        const update = () => setVisible(!document.hidden)
        document.addEventListener('visibilitychange', update)
        update()
        return () => document.removeEventListener('visibilitychange', update)
    }, [])

    return (
        <Canvas
            frameloop={visible ? 'demand' : 'never'}
            fallback={null}
            camera={{ position: [0, 0, 13], fov: 25 }}
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
            eventSource={typeof document !== 'undefined' ? document.body : undefined}
            eventPrefix="client"
        >
            <ambientLight intensity={Math.PI} />
            <Suspense fallback={null}>
                <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60} updateLoop="follow" paused={!visible}>
                    <ResponsiveBand setInteractive={setInteractive} visible={visible} onReady={onReady} onFailure={onFailure} />
                </Physics>
            </Suspense>
            <Environment background={false} blur={0.75}>
                <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
        </Canvas>
    )
}

function ResponsiveBand(props: BandProps) {
    const width = useThree((state) => state.viewport.width)
    // Rapier caches the inverse parent matrix: recreate bodies AND joints when the anchor moves.
    return <Band key={width} {...props} />
}

function Band({ maxSpeed = 50, minSpeed = 10, setInteractive, visible, onReady, onFailure }: BandProps) {
    const profileTexture = useTexture('/images/badge-texture.webp', configureProfileTexture)
    // Fiber/Rapier populate these refs before their joint and frame callbacks run.
    const band = useRef<THREE.Mesh<MeshLineGeometry>>(null!)
    const fixed = useRef<RapierRigidBody>(null!)
    const j1 = useRef<SmoothedRigidBody>(null!)
    const j2 = useRef<SmoothedRigidBody>(null!)
    const j3 = useRef<RapierRigidBody>(null!)
    const card = useRef<RapierRigidBody>(null!)
    const vec = new THREE.Vector3()
    const ang = new THREE.Vector3()
    const rot = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } satisfies RigidBodyProps
    const { nodes, materials } = useGLTF('/models/tag.glb') as BadgeModel
    const texture = useTexture('/images/band.jpg', configureBandTexture)
    const { width, height } = useThree((state) => state.size)
    const viewport = useThree((state) => state.viewport)
    const [curve] = useState(() => {
        const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
        curve.curveType = 'chordal'
        return curve
    })
    const [lineMaterialArgs] = useState<ConstructorParameters<typeof MeshLineMaterial>>(() => [{ resolution: new THREE.Vector2(1, 1) }])
    const [dragged, drag] = useState<false | THREE.Vector3>(false)
    const [hovered, hover] = useState(false)
    const capture = useRef<{ target: CaptureTarget; id: number } | null>(null)
    const ready = useRef(false)
    const resting = useRef(false)
    const { invalidate, gl, clock } = useThree()
    const wake = useCallback(() => {
        ;[card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp())
        resting.current = false
        // Demand mode's clock may have been idle for minutes.
        clock.start()
        invalidate()
    }, [clock, invalidate])
    const release = useCallback((event?: { pointerId: number }) => {
        const pointer = capture.current
        if (event && (!pointer || pointer.id !== event.pointerId)) return
        capture.current = null
        if (pointer?.target.hasPointerCapture(pointer.id)) pointer.target.releasePointerCapture(pointer.id)
        drag(false)
        hover(false)
        wake()
    }, [wake])

    useEffect(() => {
        const eventSource = document.body
        const lost = () => onFailure()
        gl.domElement.addEventListener('webglcontextlost', lost)
        window.addEventListener('pointerup', release)
        window.addEventListener('pointercancel', release)
        // Native capture can belong to an element behind the pointer-transparent canvas.
        eventSource.addEventListener('lostpointercapture', release, true)
        return () => {
            gl.domElement.removeEventListener('webglcontextlost', lost)
            window.removeEventListener('pointerup', release)
            window.removeEventListener('pointercancel', release)
            eventSource.removeEventListener('lostpointercapture', release, true)
            const pointer = capture.current
            capture.current = null
            if (pointer?.target.hasPointerCapture(pointer.id)) pointer.target.releasePointerCapture(pointer.id)
            setInteractive(false)
        }
    }, [gl, release, onFailure, setInteractive])

    useEffect(() => {
        if (visible) wake()
        else release()
    }, [visible, wake, release])

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

    useEffect(() => {
        setInteractive(visible && (hovered || dragged !== false))
        if (visible && (hovered || dragged)) {
            const previous = document.body.style.cursor
            document.body.style.cursor = dragged ? 'grabbing' : 'grab'
            return () => void (document.body.style.cursor = previous)
        }
    }, [hovered, dragged, visible, setInteractive])

    useFrame((state, delta) => {
        if (!visible || !card.current || !j1.current || !j2.current || !j3.current) return
        const asleep = !dragged && [card, j1, j2, j3].every((ref) => ref.current.isSleeping())
        if (asleep && resting.current) return
        delta = Math.min(delta, 1 / 30)
        if (dragged) {
            invalidate()
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))
                ;[card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp())
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
        }
        if (fixed.current) {
            // Fix most of the jitter when over pulling the card
            ;[j1, j2].forEach((ref) => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
                if (asleep) ref.current.lerped.copy(ref.current.translation())
                else ref.current.lerped.lerp(ref.current.translation(), Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))))
            })
            // Calculate catmul curve
            curve.points[0].copy(j3.current.translation())
            curve.points[1].copy(j2.current.lerped!)
            curve.points[2].copy(j1.current.lerped!)
            curve.points[3].copy(fixed.current.translation())
            band.current.geometry.setPoints(curve.getPoints(32))
            resting.current = asleep
            if (asleep) return
            // Tilt it back towards the screen
            ang.copy(card.current.angvel())
            const rotation = card.current.rotation()
            rot.set(rotation.x, rotation.y, rotation.z)
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false)
        }
    })

    return (
        <>
            <group position={[-viewport.width / 2 + 2.5, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={release}
                        onPointerCancel={release}
                        onPointerDown={(e) => {
                            const target = e.target as CaptureTarget
                            target.setPointerCapture(e.pointerId)
                            capture.current = { target, id: e.pointerId }
                            wake()
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
                        }}>
                        <mesh geometry={nodes.card.geometry} onAfterRender={() => {
                            if (!ready.current) {
                                ready.current = true
                                onReady()
                            }
                        }}>
                            <meshPhysicalMaterial
                                map={profileTexture}
                                clearcoat={1}
                                clearcoatRoughness={0.15}
                                roughness={0.3}
                                metalness={0.5}
                            />
                        </mesh>

                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial args={lineMaterialArgs} color="white" depthTest={false} resolution={[width, height]} useMap={1} map={texture} repeat={[-3, 1]} lineWidth={1} />
            </mesh>
        </>
    )
}
