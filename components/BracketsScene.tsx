"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BracketsScene({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const factorRef = useRef(0.47);
  const dimRef    = useRef({ w: 800, h: 400 });
  const rotYRef   = useRef(0.30);
  const rotXRef   = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const w = wrapper.clientWidth || 800;
    const h = wrapper.clientHeight || 400;
    dimRef.current = { w, h };

    const CAMERA_Z = 16;
    const V_FOV_DEG = 40;

    function bracketX(cw: number, ch: number, f: number): number {
      const halfH = CAMERA_Z * Math.tan((V_FOV_DEG / 2) * (Math.PI / 180));
      const halfW = halfH * (cw / ch);
      return halfW * f + 0.75;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(V_FOV_DEG, w / h, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    (renderer as any).toneMapping = THREE.ACESFilmicToneMapping;
    (renderer as any).toneMappingExposure = 1.3;
    (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;

    const H = 7.5, W = 1.5, T = 0.42, D = 0.85;

    const extrudeSettings = {
      depth: D,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
    };

    const leftShape = new THREE.Shape();
    leftShape.moveTo(0, 0); leftShape.lineTo(W, 0); leftShape.lineTo(W, T);
    leftShape.lineTo(T, T); leftShape.lineTo(T, H - T); leftShape.lineTo(W, H - T);
    leftShape.lineTo(W, H); leftShape.lineTo(0, H); leftShape.lineTo(0, 0);

    const rightShape = new THREE.Shape();
    rightShape.moveTo(0, 0); rightShape.lineTo(W, 0); rightShape.lineTo(W, H);
    rightShape.lineTo(0, H); rightShape.lineTo(0, H - T); rightShape.lineTo(W - T, H - T);
    rightShape.lineTo(W - T, T); rightShape.lineTo(0, T); rightShape.lineTo(0, 0);

    function centerGeo(geo: THREE.BufferGeometry) {
      geo.computeBoundingBox();
      const b = geo.boundingBox!;
      geo.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -(b.max.z + b.min.z) / 2);
      return geo;
    }

    const leftGeo = centerGeo(new THREE.ExtrudeGeometry(leftShape, extrudeSettings));
    const rightGeo = centerGeo(new THREE.ExtrudeGeometry(rightShape, extrudeSettings));

    const envScene = new THREE.Scene();
    const panels: { c: number; p: [number,number,number]; r: [number,number,number]; s: [number,number] }[] = [
      { c: 0xff00ff, p: [12,4,2],    r: [0,-1.4,0],      s: [10,14] },
      { c: 0xaa00ff, p: [10,-2,6],   r: [0,-1.2,0.2],    s: [8,10]  },
      { c: 0x00ffff, p: [-12,2,0],   r: [0,1.4,0],       s: [10,14] },
      { c: 0x00ff88, p: [-10,-4,5],  r: [0,1.2,-0.1],    s: [8,10]  },
      { c: 0x0044ff, p: [2,12,0],    r: [1.4,0,0],       s: [14,10] },
      { c: 0x6600ff, p: [-3,11,4],   r: [1.3,0.2,0],     s: [8,8]   },
      { c: 0xff0077, p: [0,-12,2],   r: [-1.4,0,0],      s: [14,10] },
      { c: 0xff44dd, p: [4,-10,-3],  r: [-1.3,0.1,0],    s: [8,8]   },
      { c: 0x00ddff, p: [0,3,12],    r: [0,Math.PI,0],   s: [10,10] },
      { c: 0x33ff99, p: [0,-2,-12],  r: [0,0,0],         s: [12,10] },
      { c: 0xffffff, p: [5,8,8],     r: [-0.4,-0.3,0],   s: [4,4]   },
      { c: 0xddaaff, p: [-4,6,10],   r: [-0.3,0.2,0],    s: [3,3]   },
      { c: 0x010101, p: [6,-6,-8],   r: [0.3,0.4,0],     s: [12,12] },
      { c: 0x020202, p: [-6,6,-6],   r: [-0.2,-0.3,0],   s: [10,10] },
      { c: 0x030303, p: [0,-8,-4],   r: [0.5,0,0],       s: [16,8]  },
    ];
    panels.forEach(({ c, p, r, s }) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(s[0], s[1]), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
      m.position.set(...p); m.rotation.set(...r); envScene.add(m);
    });

    const cubeRT = new THREE.WebGLCubeRenderTarget(512, { format: THREE.RGBAFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    const cubeCamera = new THREE.CubeCamera(0.1, 50, cubeRT);
    cubeCamera.update(renderer, envScene);

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, envMap: cubeRT.texture, envMapIntensity: 4.0 });

    const leftBracket = new THREE.Mesh(leftGeo, chromeMat);
    leftBracket.position.x = -bracketX(w, h, factorRef.current);
    leftBracket.scale.set(1.18, 1.18, 1.18);
    scene.add(leftBracket);

    const rightBracket = new THREE.Mesh(rightGeo, chromeMat);
    rightBracket.position.x = bracketX(w, h, factorRef.current);
    rightBracket.scale.set(1.18, 1.18, 1.18);
    scene.add(rightBracket);

    scene.add(new THREE.AmbientLight(0x111111, 0.2));
    const key  = new THREE.PointLight(0xffffff, 0.4,  30); key.position.set(4, 5, 8);    scene.add(key);
    const fill = new THREE.PointLight(0xaaaaff, 0.3,  25); fill.position.set(-5, 2, 7);  scene.add(fill);
    const rim  = new THREE.PointLight(0xff88ff, 0.4,  25); rim.position.set(0, -4, -6);  scene.add(rim);
    const warm = new THREE.PointLight(0xff00cc, 0.25, 20); warm.position.set(8, 4, 3);   scene.add(warm);
    const cool = new THREE.PointLight(0x00ffee, 0.2,  20); cool.position.set(-8, -2, 3); scene.add(cool);

    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          dimRef.current = { w: width, h: height };
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    ro.observe(wrapper);

    const clock = new THREE.Clock();
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { w: cw, h: ch } = dimRef.current;

      // Apply factor from slider every frame
      const bx = bracketX(cw, ch, factorRef.current);
      leftBracket.position.x = -bx;
      rightBracket.position.x = bx;

      const breathe = Math.sin(t * 0.4) * 0.1;
      const sway = Math.sin(t * 0.25) * 0.06;

      const ry = rotYRef.current;
      const rx = rotXRef.current;

      leftBracket.rotation.y = ry + sway + mx * 0.12;
      leftBracket.rotation.x = rx + breathe * 0.3 + my * 0.08;
      leftBracket.rotation.z = Math.sin(t * 0.3) * 0.02;
      leftBracket.position.y = Math.sin(t * 0.35) * 0.1;

      rightBracket.rotation.y = -ry - sway - mx * 0.12;
      rightBracket.rotation.x = rx - breathe * 0.3 - my * 0.08;
      rightBracket.rotation.z = -Math.sin(t * 0.3 + 0.5) * 0.02;
      rightBracket.position.y = Math.sin(t * 0.35 + 1.0) * 0.1;

      warm.position.x = 8 + Math.sin(t * 0.3) * 3;
      warm.position.y = 4 + Math.cos(t * 0.25) * 2;
      cool.position.x = -8 + Math.cos(t * 0.35) * 3;

      frame++;
      if (frame % 90 === 0) {
        envScene.children.forEach((child, i) => {
          if (i < 10) { child.rotation.z += 0.015; child.position.y += Math.sin(t * 0.08 + i) * 0.03; }
        });
        cubeCamera.update(renderer, envScene);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      leftGeo.dispose(); rightGeo.dispose(); chromeMat.dispose(); cubeRT.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />

    </div>
  );
}
