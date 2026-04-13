"use client";

import { useEffect, useRef, CSSProperties } from "react";
import * as THREE from "three";

interface BracketCanvasProps {
  mirrored?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function BracketCanvas({ mirrored = false, className = "", style }: BracketCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let w = wrapper.clientWidth || 160;
    let h = wrapper.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x090909, 1);
    (renderer as any).toneMapping = THREE.ACESFilmicToneMapping;
    (renderer as any).toneMappingExposure = 1.3;
    (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;

    // === BRACKET SHAPE ===
    const H = 6.0;
    const W = 2.8;
    const T = 0.7;
    const D = 1.2;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(W, 0);
    shape.lineTo(W, T);
    shape.lineTo(T, T);
    shape.lineTo(T, H - T);
    shape.lineTo(W, H - T);
    shape.lineTo(W, H);
    shape.lineTo(0, H);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth: D,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelOffset: 0,
      bevelSegments: 3,
    };

    const bracketGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    bracketGeo.computeBoundingBox();
    const bb = bracketGeo.boundingBox!;
    const cx = (bb.max.x + bb.min.x) / 2;
    const cy = (bb.max.y + bb.min.y) / 2;
    const cz = (bb.max.z + bb.min.z) / 2;
    bracketGeo.translate(-cx, -cy, -cz);

    if (mirrored) {
      bracketGeo.scale(-1, 1, 1);
    }

    // === ENVIRONMENT ===
    const envScene = new THREE.Scene();
    const envPanels: { color: number; pos: [number,number,number]; rot: [number,number,number]; size: [number,number] }[] = [
      { color: 0xff2200, pos: [12, 4, 2],   rot: [0, -Math.PI/2.2, 0],  size: [10, 14] },
      { color: 0xff6600, pos: [10, -2, 6],  rot: [0, -Math.PI/2.5, 0.2], size: [8, 10] },
      { color: 0x00ff66, pos: [-12, 2, 0],  rot: [0, Math.PI/2.2, 0],   size: [10, 14] },
      { color: 0x00ccaa, pos: [-10, -4, 5], rot: [0, Math.PI/2.5, -0.1], size: [8, 10] },
      { color: 0x2244ff, pos: [2, 12, 0],   rot: [Math.PI/2.2, 0, 0],   size: [14, 10] },
      { color: 0x8800ff, pos: [-3, 11, 4],  rot: [Math.PI/2.3, 0.2, 0], size: [8, 8]  },
      { color: 0xff0088, pos: [0, -12, 2],  rot: [-Math.PI/2.2, 0, 0],  size: [14, 10] },
      { color: 0xcc00ff, pos: [4, -10, -3], rot: [-Math.PI/2.3, 0.1, 0], size: [8, 8] },
      { color: 0xffcc00, pos: [0, 3, 12],   rot: [0, Math.PI, 0],       size: [10, 10] },
      { color: 0x00ddff, pos: [0, -2, -12], rot: [0, 0, 0],             size: [12, 10] },
      { color: 0xffffff, pos: [5, 8, 8],    rot: [-0.4, -0.3, 0],       size: [4, 4]  },
      { color: 0xeeeeee, pos: [-4, 6, 10],  rot: [-0.3, 0.2, 0],        size: [3, 3]  },
      { color: 0x080808, pos: [6, -6, -8],  rot: [0.3, 0.4, 0],         size: [12, 12] },
      { color: 0x050505, pos: [-6, 6, -6],  rot: [-0.2, -0.3, 0],       size: [10, 10] },
      { color: 0x0a0a0a, pos: [0, -8, -4],  rot: [0.5, 0, 0],           size: [16, 8] },
    ];

    envPanels.forEach(({ color, pos, rot, size }) => {
      const geo = new THREE.PlaneGeometry(size[0], size[1]);
      const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      envScene.add(mesh);
    });

    const cubeRT = new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 50, cubeRT);
    cubeCamera.position.set(0, 0, 0);
    cubeCamera.update(renderer, envScene);

    // === CHROME MATERIAL ===
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 1.0,
      roughness: 0.03,
      envMap: cubeRT.texture,
      envMapIntensity: 2.5,
    });

    const bracket = new THREE.Mesh(bracketGeo, chromeMat);
    scene.add(bracket);

    scene.add(new THREE.AmbientLight(0x111111, 0.2));
    const key = new THREE.PointLight(0xffffff, 0.6, 30);
    key.position.set(4, 5, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 0.4, 25);
    rim.position.set(-3, -3, -5);
    scene.add(rim);

    // === MOUSE ===
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // === RESIZE OBSERVER — keeps renderer in sync with container ===
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    ro.observe(wrapper);

    // === ANIMATE ===
    const clock = new THREE.Clock();
    let envFrame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      bracket.rotation.y = Math.sin(t * 0.25) * 0.15 + mx * 0.25;
      bracket.rotation.x = Math.sin(t * 0.3) * 0.08 + my * 0.15;
      bracket.rotation.z = Math.sin(t * 0.2) * 0.03;
      bracket.position.y = Math.sin(t * 0.35) * 0.12;

      envFrame++;
      if (envFrame % 90 === 0) {
        envScene.children.forEach((child, i) => {
          if (i < 10) {
            child.rotation.z += 0.02;
            child.position.y += Math.sin(t * 0.1 + i) * 0.05;
          }
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
      bracketGeo.dispose();
      chromeMat.dispose();
      cubeRT.dispose();
    };
  }, [mirrored]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
