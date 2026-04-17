"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BracketsScene({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dimRef     = useRef({ w: 800, h: 400 });
  const factorRef  = useRef(0.47);
  const rotYRef    = useRef(0.30);
  const rotXRef    = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    const w = wrapper.clientWidth  || 800;
    const h = wrapper.clientHeight || 400;
    dimRef.current = { w, h };

    const CAMERA_Z  = 16;
    const V_FOV_DEG = 40;

    function bracketX(cw: number, ch: number, f: number): number {
      const halfH = CAMERA_Z * Math.tan((V_FOV_DEG / 2) * (Math.PI / 180));
      const halfW = halfH * (cw / ch);
      return halfW * f + 0.75;
    }

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(V_FOV_DEG, w / h, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    (renderer as any).toneMapping         = THREE.ACESFilmicToneMapping;
    (renderer as any).toneMappingExposure = 1.8;
    (renderer as any).outputEncoding      = (THREE as any).sRGBEncoding;

    // === GEOMETRY ===
    const H = 7.5, W = 1.5, T = 0.42, D = 0.85;
    const extrudeSettings = { depth: D, bevelEnabled: false };

    const leftShape = new THREE.Shape();
    leftShape.moveTo(0,0); leftShape.lineTo(W,0); leftShape.lineTo(W,T);
    leftShape.lineTo(T,T); leftShape.lineTo(T,H-T); leftShape.lineTo(W,H-T);
    leftShape.lineTo(W,H); leftShape.lineTo(0,H); leftShape.lineTo(0,0);

    const rightShape = new THREE.Shape();
    rightShape.moveTo(0,0); rightShape.lineTo(W,0); rightShape.lineTo(W,H);
    rightShape.lineTo(0,H); rightShape.lineTo(0,H-T); rightShape.lineTo(W-T,H-T);
    rightShape.lineTo(W-T,T); rightShape.lineTo(0,T); rightShape.lineTo(0,0);

    function centerGeo(geo: THREE.BufferGeometry) {
      geo.computeBoundingBox();
      const b = geo.boundingBox!;
      geo.translate(-(b.max.x+b.min.x)/2, -(b.max.y+b.min.y)/2, -(b.max.z+b.min.z)/2);
      return geo;
    }

    const leftGeo  = centerGeo(new THREE.ExtrudeGeometry(leftShape,  extrudeSettings));
    const rightGeo = centerGeo(new THREE.ExtrudeGeometry(rightShape, extrudeSettings));

    // === CANVAS EQUIRECTANGULAR ENV — paleta Createca ===
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024; envCanvas.height = 512;
    const ctx2d = envCanvas.getContext("2d")!;

    // Base gradient: white top → vivid orange-red → black → vivid blue
    const vgrad = ctx2d.createLinearGradient(0, 0, 0, 512);
    vgrad.addColorStop(0.00, "#ffffff");
    vgrad.addColorStop(0.08, "#ffffff");
    vgrad.addColorStop(0.18, "#ff8833");
    vgrad.addColorStop(0.30, "#ff3300");
    vgrad.addColorStop(0.42, "#cc1100");
    vgrad.addColorStop(0.50, "#000000");
    vgrad.addColorStop(0.62, "#0022bb");
    vgrad.addColorStop(0.78, "#1144dd");
    vgrad.addColorStop(1.00, "#2255ff");
    ctx2d.fillStyle = vgrad;
    ctx2d.fillRect(0, 0, 1024, 512);

    // Vertical streaks — white hot, orange, blue
    for (let i = 0; i < 60; i++) {
      const x = (i / 60) * 1024;
      const w2 = 2 + Math.random() * 6;
      const sg = ctx2d.createLinearGradient(0, 0, 0, 512);
      const kind = i % 3;
      if (kind === 0) {
        // white hot streak
        sg.addColorStop(0.00, "rgba(255,255,255,1.0)");
        sg.addColorStop(0.15, "rgba(255,255,255,0.80)");
        sg.addColorStop(0.40, "rgba(255,255,255,0.15)");
        sg.addColorStop(0.55, "rgba(0,0,0,0)");
        sg.addColorStop(1.00, "rgba(255,255,255,0.05)");
      } else if (kind === 1) {
        // vivid orange-red streak
        sg.addColorStop(0.00, "rgba(255,255,255,0.90)");
        sg.addColorStop(0.12, "rgba(255,140,40,0.85)");
        sg.addColorStop(0.28, "rgba(255,60,0,0.70)");
        sg.addColorStop(0.45, "rgba(200,20,0,0.20)");
        sg.addColorStop(0.55, "rgba(0,0,0,0)");
        sg.addColorStop(1.00, "rgba(30,80,220,0.10)");
      } else {
        // vivid blue streak
        sg.addColorStop(0.00, "rgba(255,255,255,0.70)");
        sg.addColorStop(0.45, "rgba(0,0,0,0)");
        sg.addColorStop(0.60, "rgba(20,60,200,0.50)");
        sg.addColorStop(0.80, "rgba(30,80,255,0.80)");
        sg.addColorStop(1.00, "rgba(40,100,255,0.90)");
      }
      ctx2d.fillStyle = sg;
      ctx2d.fillRect(x, 0, w2, 512);
    }

    // Central white hot-spot band
    const hband = ctx2d.createLinearGradient(0, 0, 1024, 0);
    hband.addColorStop(0.0, "rgba(255,255,255,0)");
    hband.addColorStop(0.3, "rgba(255,255,255,0.40)");
    hband.addColorStop(0.5, "rgba(255,255,255,0.70)");
    hband.addColorStop(0.7, "rgba(255,255,255,0.40)");
    hband.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx2d.fillStyle = hband;
    ctx2d.fillRect(0, 0, 1024, 90);

    const envTex  = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem   = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envMap  = pmrem.fromEquirectangular(envTex).texture;

    // === CHROME MATERIAL — Createca chrome ===
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.02,
      envMap,
      envMapIntensity: 8.0,
    });

    const topArmY = H/2 - T/2;
    const botArmY = -H/2 + T/2;

    function prism(gx: number, gy: number, gz: number, px: number, py: number, pz: number) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(gx, gy, gz), chromeMat);
      m.position.set(px, py, pz);
      return m;
    }

    // === LEFT GROUP [ ===
    const leftGroup = new THREE.Group();
    leftGroup.add(new THREE.Mesh(leftGeo, chromeMat));
    // side prisms
    leftGroup.add(prism(0.04,  H, D, -W/2-0.06, 0, 0));
    leftGroup.add(prism(0.022, H, D, -W/2-0.12, 0, 0));
    leftGroup.add(prism(0.014, H, D, -W/2-0.17, 0, 0));
    // patita prisms
    leftGroup.add(prism(0.04,  T, D,  W/2+0.06, topArmY, 0));
    leftGroup.add(prism(0.04,  T, D,  W/2+0.06, botArmY, 0));
    leftGroup.add(prism(0.014, T, D,  W/2+0.12, topArmY, 0));
    leftGroup.add(prism(0.014, T, D,  W/2+0.12, botArmY, 0));
    // inner prisms
    leftGroup.add(prism(0.04,  H, D, -W/2+T+0.06, 0, 0));
    leftGroup.add(prism(0.014, H, D, -W/2+T+0.12, 0, 0));
    scene.add(leftGroup);

    // === RIGHT GROUP ] ===
    const rightGroup = new THREE.Group();
    rightGroup.add(new THREE.Mesh(rightGeo, chromeMat));
    // side prisms
    rightGroup.add(prism(0.04,  H, D,  W/2+0.06, 0, 0));
    rightGroup.add(prism(0.022, H, D,  W/2+0.12, 0, 0));
    rightGroup.add(prism(0.014, H, D,  W/2+0.17, 0, 0));
    // patita prisms
    rightGroup.add(prism(0.04,  T, D, -W/2-0.06, topArmY, 0));
    rightGroup.add(prism(0.04,  T, D, -W/2-0.06, botArmY, 0));
    rightGroup.add(prism(0.014, T, D, -W/2-0.12, topArmY, 0));
    rightGroup.add(prism(0.014, T, D, -W/2-0.12, botArmY, 0));
    // inner prisms
    rightGroup.add(prism(0.04,  H, D,  W/2-T-0.06, 0, 0));
    rightGroup.add(prism(0.014, H, D,  W/2-T-0.12, 0, 0));
    scene.add(rightGroup);

    // === LIGHTS — Createca palette ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    const key  = new THREE.PointLight(0xffffff, 4.0, 40); key.position.set(0,  12,  10); scene.add(key);
    const red  = new THREE.PointLight(0xff3300, 2.5, 25); red.position.set(6,   5,   4); scene.add(red);
    const blue = new THREE.PointLight(0x2255ff, 2.0, 25); blue.position.set(-6, -5,   4); scene.add(blue);
    const rim  = new THREE.PointLight(0xffffff, 1.2, 20); rim.position.set(0,   0,  -8); scene.add(rim);

    // === MOUSE ===
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // === RESIZE ===
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          dimRef.current = { w: width, h: height };
          camera.aspect  = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    ro.observe(wrapper);

    // === ANIMATE ===
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { w: cw, h: ch } = dimRef.current;

      const bx      = bracketX(cw, ch, factorRef.current);
      const breathe = Math.sin(t * 0.4) * 0.1;
      const sway    = Math.sin(t * 0.25) * 0.06;
      const ry      = rotYRef.current;
      const rx      = rotXRef.current;

      leftGroup.position.x  = -bx;
      leftGroup.rotation.y  = ry + sway + mx * 0.12;
      leftGroup.rotation.x  = rx + breathe * 0.3 + my * 0.08;
      leftGroup.rotation.z  = Math.sin(t * 0.3) * 0.02;
      leftGroup.position.y  = Math.sin(t * 0.35) * 0.1;

      rightGroup.position.x = bx;
      rightGroup.rotation.y = -ry - sway - mx * 0.12;
      rightGroup.rotation.x = rx - breathe * 0.3 - my * 0.08;
      rightGroup.rotation.z = -Math.sin(t * 0.3 + 0.5) * 0.02;
      rightGroup.position.y = Math.sin(t * 0.35 + 1.0) * 0.1;

      red.position.x  =  6 + Math.sin(t * 0.3)  * 3;
      red.position.y  =  5 + Math.cos(t * 0.25) * 2;
      blue.position.x = -6 + Math.cos(t * 0.35) * 3;
      blue.position.y = -5 + Math.sin(t * 0.28) * 2;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      leftGeo.dispose();
      rightGeo.dispose();
      chromeMat.dispose();
      envMap.dispose();
      envTex.dispose();
      pmrem.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
