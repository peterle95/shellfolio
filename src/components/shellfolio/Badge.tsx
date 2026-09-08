// @ts-nocheck
"use client";

import * as THREE from 'three'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'

extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/models/tag.glb')
useTexture.preload('/images/band.jpg')

export default function Badge({ onReady, onFailure }) {
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
            // @ts-ignore
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

function ResponsiveBand(props) {
    const width = useThree((state) => state.viewport.width)
    // Rapier caches the inverse parent matrix: recreate bodies AND joints when the anchor moves.
    return <Band key={width} {...props} />
}

function Band({ maxSpeed = 50, minSpeed = 10, setInteractive, visible, onReady, onFailure }: any) {
    const profileTexture = useTexture('/images/badge-texture.webp')
    profileTexture.colorSpace = THREE.SRGBColorSpace
    profileTexture.flipY = false
    profileTexture.repeat.set(2, 2)
    profileTexture.offset.set(-0.1, -0.3)
    // @ts-ignore
    const band = useRef<any>(null)
    // @ts-ignore
    const fixed = useRef<any>(null)
    // @ts-ignore
    const j1 = useRef<any>(null)
    // @ts-ignore
    const j2 = useRef<any>(null)
    // @ts-ignore
    const j3 = useRef<any>(null)
    // @ts-ignore
    const card = useRef<any>(null)
    const vec = new THREE.Vector3()
    const ang = new THREE.Vector3()
    const rot = new THREE.Vector3()
    const dir = new THREE.Vector3()
    // @ts-ignore
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
    // @ts-ignore
    const { nodes, materials } = useGLTF('/models/tag.glb')
    const texture = useTexture('/images/band.jpg')
    const { width, height } = useThree((state) => state.size)
    const viewport = useThree((state) => state.viewport)
    const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
    const [dragged, drag] = useState<false | THREE.Vector3>(false)
    const [hovered, hover] = useState(false)
    const capture = useRef(null)
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
    const release = useCallback((event?) => {
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
            // @ts-ignore
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))
                ;[card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp())
            // @ts-ignore
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
        }
        if (fixed.current) {
            // Fix most of the jitter when over pulling the card
            ;[j1, j2].forEach((ref) => {
                // @ts-ignore
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
                // @ts-ignore
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
                // @ts-ignore
                if (asleep) ref.current.lerped.copy(ref.current.translation())
                else ref.current.lerped.lerp(ref.current.translation(), Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))))
            })
            // Calculate catmul curve
            // @ts-ignore
            curve.points[0].copy(j3.current.translation())
            // @ts-ignore
            curve.points[1].copy(j2.current.lerped)
            // @ts-ignore
            curve.points[2].copy(j1.current.lerped)
            // @ts-ignore
            curve.points[3].copy(fixed.current.translation())
            // @ts-ignore
            band.current.geometry.setPoints(curve.getPoints(32))
            resting.current = asleep
            if (asleep) return
            // Tilt it back towards the screen
            // @ts-ignore
            ang.copy(card.current.angvel())
            // @ts-ignore
            rot.copy(card.current.rotation())
            // @ts-ignore
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false)
        }
    })

    curve.curveType = 'chordal'
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping

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
                {/* @ts-ignore */}
                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        // @ts-ignore
                        onPointerUp={release}
                        onPointerCancel={release}
                        // @ts-ignore
                        onPointerDown={(e) => {
                            e.target.setPointerCapture(e.pointerId)
                            capture.current = { target: e.target, id: e.pointerId }
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
                {/* @ts-ignore */}
                <meshLineGeometry />
                {/* @ts-ignore */}
                <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
            </mesh>
        </>
    )
}
