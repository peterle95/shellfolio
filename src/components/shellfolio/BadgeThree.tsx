"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const [threeActive, setThreeActive] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const THREE = window.THREE;

    if (!mount || !THREE || !threeReady) return;

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setThreeActive(false);
      return;
    }

    if (!renderer || !renderer.getContext()) {
      setThreeActive(false);
      return;
    }

    setThreeActive(true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1b0c53, 4, 16);

    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.2, 6.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.54));

    const key = new THREE.DirectionalLight(0xf7f0df, 1.25);
    key.position.set(3.8, 5.2, 3.5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x79abff, 0.75);
    rim.position.set(-4, 2.5, -4);
    scene.add(rim);

    const frontFill = new THREE.PointLight(0xffffff, 0.85, 12);
    frontFill.position.set(0.2, 0.4, 4.5);
    scene.add(frontFill);

    const anchor = new THREE.Vector3(0, 2.3, -0.08);
    const restPos = new THREE.Vector3(0, -1.02, 0);
    const badgePos = restPos.clone();
    const velocity = new THREE.Vector3();

    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    const metalMat = new THREE.MeshPhysicalMaterial({ color: 0xd9dee8, metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 });

    const lanyardRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.026, 18, 56), metalMat);
    lanyardRing.position.set(0, 1.93, 0.02);
    badgeGroup.add(lanyardRing);

    const claspBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.09), new THREE.MeshPhysicalMaterial({ color: 0xc9ced9, metalness: 1, roughness: 0.24, clearcoat: 1 }));
    claspBody.position.set(0, 1.66, 0.02);
    badgeGroup.add(claspBody);

    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.019, 14, 42), metalMat);
    hook.position.set(0, 1.43, 0.02);
    badgeGroup.add(hook);

    const leatherFrame = new THREE.Mesh(new THREE.BoxGeometry(2.62, 3.84, 0.22, 4, 6, 1), new THREE.MeshPhysicalMaterial({ color: 0x1c1c1e, roughness: 0.85, metalness: 0.04, clearcoat: 0.24, clearcoatRoughness: 0.5 }));
    leatherFrame.position.set(0, -0.18, 0);
    badgeGroup.add(leatherFrame);

    const innerCard = new THREE.Mesh(new THREE.BoxGeometry(2.16, 3.24, 0.08), new THREE.MeshPhysicalMaterial({ color: 0xf1f4f8, roughness: 0.45, clearcoat: 0.5, transmission: 0.01 }));
    innerCard.position.set(0, -0.22, 0.12);
    badgeGroup.add(innerCard);

    const cardTop = new THREE.Mesh(new THREE.PlaneGeometry(2.08, 1.45), new THREE.MeshStandardMaterial({ color: 0x22488c, roughness: 0.65 }));
    cardTop.position.set(0, 0.48, 0.168);
    badgeGroup.add(cardTop);

    const photoTexture = new THREE.TextureLoader().load('/images/batch.jpeg');
    photoTexture.colorSpace = THREE.SRGBColorSpace;

    const photoDisc = new THREE.Mesh(new THREE.CircleGeometry(0.48, 40), new THREE.MeshStandardMaterial({ map: photoTexture, roughness: 0.78, metalness: 0.03 }));
    photoDisc.position.set(0, 0.27, 0.172);
    badgeGroup.add(photoDisc);

    const gloss = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 3.38), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0 }));
    gloss.position.set(0, -0.2, 0.175);
    gloss.rotation.z = -0.07;
    badgeGroup.add(gloss);

    const ropePoints = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const ropeCurve = new THREE.CatmullRomCurve3(ropePoints);
    const rope = new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 40, 0.035, 12, false), new THREE.MeshStandardMaterial({ color: 0x101012, roughness: 0.92 }));
    scene.add(rope);

    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const dragPoint = new THREE.Vector3();
    let dragging = false;

    const worldHook = () => new THREE.Vector3(0, 1.93, 0.02).add(badgePos);

    const updatePointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      raycaster.ray.intersectPlane(dragPlane, dragPoint);
    };

    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event);
      if (dragPoint.distanceTo(badgePos) < 2.05) {
        dragging = true;
        mount.setPointerCapture(event.pointerId);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      updatePointer(event);
      const target = dragPoint.clone();
      target.z = 0;
      const maxRadius = 2.95;
      const fromAnchor = target.clone().sub(anchor);
      if (fromAnchor.length() > maxRadius) {
        fromAnchor.setLength(maxRadius);
        target.copy(anchor).add(fromAnchor);
      }
      badgePos.lerp(target, 0.35);
      velocity.multiplyScalar(0.72);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      mount.releasePointerCapture(event.pointerId);
    };

    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);

    const clock = new THREE.Clock();

    const updateRope = () => {
      const start = anchor;
      const end = worldHook();
      const span = end.clone().sub(start);
      const distance = span.length();
      const sag = Math.min(0.55, 0.16 + distance * 0.11 + velocity.length() * 0.06);

      ropePoints[0].copy(start);
      ropePoints[1].copy(start).add(new THREE.Vector3(span.x * 0.2, span.y * 0.25 - sag, span.z));
      ropePoints[2].copy(start).add(new THREE.Vector3(span.x * 0.72, span.y * 0.82 - sag * 0.55, span.z));
      ropePoints[3].copy(end);

      rope.geometry.dispose();
      rope.geometry = new THREE.TubeGeometry(ropeCurve, 40, 0.035, 12, false);
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    let raf = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);

      if (!dragging) {
        const springK = 14;
        const damping = 5.4;
        const gravity = -2.4;

        const offset = badgePos.clone().sub(restPos);
        const accel = offset.multiplyScalar(-springK).add(new THREE.Vector3(0, gravity, 0)).add(velocity.clone().multiplyScalar(-damping));
        velocity.addScaledVector(accel, dt);
        badgePos.addScaledVector(velocity, dt);

        const ropeLimit = 3.05;
        const fromAnchor = badgePos.clone().sub(anchor);
        if (fromAnchor.length() > ropeLimit) {
          fromAnchor.setLength(ropeLimit);
          badgePos.copy(anchor).add(fromAnchor);
          const normal = fromAnchor.clone().normalize();
          const vAlong = normal.multiplyScalar(velocity.dot(normal));
          velocity.sub(vAlong.multiplyScalar(0.82));
        }
      }

      badgeGroup.position.copy(badgePos);
      badgeGroup.rotation.z = THREE.MathUtils.clamp((badgePos.x - restPos.x) * 0.26 + velocity.x * 0.03, -0.4, 0.4);
      badgeGroup.rotation.x = THREE.MathUtils.clamp(-velocity.y * 0.025, -0.18, 0.18);
      lanyardRing.rotation.z += 0.01;

      updateRope();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    updateRope();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((m: any) => m.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      mount.innerHTML = '';
      setThreeActive(false);
    };
  }, [threeReady]);

  useEffect(() => {
    if (threeActive || !fallbackRef.current) return;

    const badge = fallbackRef.current.querySelector<HTMLElement>('[data-badge]');
    const string = fallbackRef.current.querySelector<SVGPathElement>('[data-string]');
    if (!badge || !string) return;

    const center = { x: 0, y: 150 };
    const anchor = { x: 0, y: -120 };
    const state = { x: 0, y: 150, vx: 0, vy: 0 };
    let dragging = false;
    let raf = 0;

    const updateVisual = () => {
      badge.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.x * 0.06}deg)`;
      const ctrl1x = state.x * 0.2;
      const ctrl1y = anchor.y + 80;
      const ctrl2x = state.x * 0.75;
      const ctrl2y = state.y - 68;
      string.setAttribute('d', `M ${anchor.x} ${anchor.y} C ${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${state.x} ${state.y - 105}`);
    };

    const animate = () => {
      if (!dragging) {
        const k = 0.05;
        const damping = 0.9;
        const gravity = 0.16;

        state.vx += (center.x - state.x) * k;
        state.vy += (center.y - state.y) * k + gravity;
        state.vx *= damping;
        state.vy *= damping;
        state.x += state.vx;
        state.y += state.vy;
      }

      updateVisual();
      raf = requestAnimationFrame(animate);
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = fallbackRef.current!.getBoundingClientRect();
      return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - 20 };
    };

    const down = (event: PointerEvent) => {
      dragging = true;
      badge.setPointerCapture(event.pointerId);
    };

    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const p = toLocal(event.clientX, event.clientY);
      const dx = p.x - anchor.x;
      const dy = p.y - anchor.y;
      const maxLen = 350;
      const len = Math.hypot(dx, dy);
      if (len > maxLen) {
        state.x = anchor.x + (dx / len) * maxLen;
        state.y = anchor.y + (dy / len) * maxLen;
      } else {
        state.x = p.x;
        state.y = p.y;
      }
      state.vx = 0;
      state.vy = 0;
    };

    const up = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      badge.releasePointerCapture(event.pointerId);
    };

    badge.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    updateVisual();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      badge.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [threeActive]);

  return (
    <div className="relative h-[460px] w-[320px]">
      {!threeActive && (
        <div ref={fallbackRef} className="absolute inset-0 overflow-hidden rounded-2xl">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="-160 -140 320 460" fill="none">
            <path data-string stroke="#121212" strokeWidth="7" strokeLinecap="round" />
          </svg>
          <div data-badge className="absolute left-1/2 top-0 h-[280px] w-[190px] -translate-x-1/2 cursor-grab rounded-2xl border-4 border-zinc-900 bg-zinc-900 p-3 shadow-[0_16px_30px_rgba(0,0,0,0.45)] active:cursor-grabbing">
            <div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-100">
              <div className="absolute inset-x-0 top-0 h-16 bg-[#23498c]" />
              <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white bg-zinc-200">
                <Image src="/images/batch.jpeg" alt="Photo of Peter Mölzer" fill className="object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 h-14 rounded bg-white" />
            </div>
          </div>
        </div>
      )}
      <div ref={mountRef} className="h-[460px] w-[320px]" aria-label="3D hanging badge" />
    </div>
  );
}
