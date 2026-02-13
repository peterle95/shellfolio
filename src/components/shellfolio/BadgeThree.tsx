"use client";

import Image from 'next/image';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE?: any;
  }
}

type BadgeThreeProps = {
  threeReady: boolean;
};

export function BadgeThree({ threeReady }: BadgeThreeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const THREE = window.THREE;

    if (!mount || !THREE || !threeReady) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1f0a57, 5, 16);

    const camera = new THREE.PerspectiveCamera(33, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.12, 5.8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyLight = new THREE.DirectionalLight(0xfff3d6, 1.2);
    keyLight.position.set(3.5, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x88b8ff, 0.9);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.7, 10);
    fillLight.position.set(0, 2.4, 2.8);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 2.25, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.82, metalness: 0.1 })
    );
    strap.position.set(0, 1.78, -0.12);
    group.add(strap);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8dde6,
      metalness: 1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.3,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.038, 24, 64), metalMat);
    ring.position.set(0, 0.74, -0.06);
    group.add(ring);

    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.32, 24), metalMat);
    hook.position.set(0, 0.46, -0.05);
    group.add(hook);

    const badgeBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.75, 3.85, 0.14, 3, 3, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0xe8ebef,
        roughness: 0.32,
        metalness: 0.02,
        clearcoat: 0.6,
        transmission: 0.03,
        thickness: 0.2,
      })
    );
    badgeBody.position.set(0, -1.2, 0);
    group.add(badgeBody);

    const photo = new THREE.TextureLoader().load('/images/batch.jpeg');
    photo.colorSpace = THREE.SRGBColorSpace;

    const photoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.35, 2.95),
      new THREE.MeshStandardMaterial({ map: photo, roughness: 0.8, metalness: 0.02 })
    );
    photoPlane.position.set(0, -1.07, 0.075);
    group.add(photoPlane);

    const sheen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.65, 3.55),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.14,
        roughness: 0.05,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0,
        side: THREE.DoubleSide,
      })
    );
    sheen.position.set(0, -1.18, 0.082);
    sheen.rotation.set(0, 0, -0.06);
    group.add(sheen);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xf8f9fb, roughness: 0.5 })
    );
    label.position.set(0, -2.54, 0.08);
    group.add(label);

    const targetRotation = new THREE.Vector2(0, 0);
    const velocity = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetRotation.x = (0.5 - y) * 0.65;
      targetRotation.y = (x - 0.5) * 0.78;
    };

    const onPointerLeave = () => targetRotation.set(0, 0);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerleave', onPointerLeave);

    const spring = 26;
    const damping = 8.5;
    const clock = new THREE.Clock();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    let raf = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const ax = spring * (targetRotation.x - current.x) - damping * velocity.x;
      const ay = spring * (targetRotation.y - current.y) - damping * velocity.y;
      velocity.x += ax * dt;
      velocity.y += ay * dt;
      current.x += velocity.x * dt;
      current.y += velocity.y * dt;

      group.rotation.x = current.x;
      group.rotation.y = current.y;
      group.position.y = Math.sin(clock.elapsedTime * 1.3) * 0.05;
      ring.rotation.z += 0.01;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((m: any) => m.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [threeReady]);

  return (
    <div className="relative h-[430px] w-[300px]">
      {!threeReady && (
        <div className="absolute inset-0 rounded-2xl border border-zinc-300/80 bg-zinc-100/80 p-3 shadow-2xl">
          <Image src="/images/batch.jpeg" alt="Photo of Peter Mölzer" fill className="rounded-xl object-cover p-3" />
        </div>
      )}
      <div ref={mountRef} className="h-[430px] w-[300px]" aria-label="3D realistic badge" />
    </div>
  );
}
