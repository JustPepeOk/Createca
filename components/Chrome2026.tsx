"use client";

import { useEffect, useRef, CSSProperties } from "react";
import * as THREE from "three";
import opentype from "opentype.js";
import FONT_B64 from "@/lib/jetbrains-b64";

export default function Chrome2026({ className = "", style, scale = 2.2 }: { className?: string; style?: CSSProperties; scale?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef(scale);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const w = wrapper.clientWidth || 400;
    const h = wrapper.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    (renderer as any).toneMapping = THREE.ACESFilmicToneMapping;
    (renderer as any).toneMappingExposure = 1.3;
    (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;

    // === CHROME ENVIRONMENT ===
    const envScene = new THREE.Scene();
    const panels: { c: number; p: [number,number,number]; r: [number,number,number]; s: [number,number] }[] = [
      { c: 0xff2200, p: [12,4,2],    r: [0,-1.4,0],      s: [10,14] },
      { c: 0xff6600, p: [10,-2,6],   r: [0,-1.2,0.2],    s: [8,10]  },
      { c: 0x00ff66, p: [-12,2,0],   r: [0,1.4,0],       s: [10,14] },
      { c: 0x00ccaa, p: [-10,-4,5],  r: [0,1.2,-0.1],    s: [8,10]  },
      { c: 0x2244ff, p: [2,12,0],    r: [1.4,0,0],       s: [14,10] },
      { c: 0x8800ff, p: [-3,11,4],   r: [1.3,0.2,0],     s: [8,8]   },
      { c: 0xff0088, p: [0,-12,2],   r: [-1.4,0,0],      s: [14,10] },
      { c: 0xcc00ff, p: [4,-10,-3],  r: [-1.3,0.1,0],    s: [8,8]   },
      { c: 0xffcc00, p: [0,3,12],    r: [0,Math.PI,0],   s: [10,10] },
      { c: 0x00ddff, p: [0,-2,-12],  r: [0,0,0],         s: [12,10] },
      { c: 0xffffff, p: [5,8,8],     r: [-0.4,-0.3,0],   s: [4,4]   },
      { c: 0xeeeeee, p: [-4,6,10],   r: [-0.3,0.2,0],    s: [3,3]   },
      { c: 0x080808, p: [6,-6,-8],   r: [0.3,0.4,0],     s: [12,12] },
      { c: 0x050505, p: [-6,6,-6],   r: [-0.2,-0.3,0],   s: [10,10] },
      { c: 0x0a0a0a, p: [0,-8,-4],   r: [0.5,0,0],       s: [16,8]  },
    ];
    panels.forEach(({ c, p, r, s }) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(s[0], s[1]),
        new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })
      );
      m.position.set(...p); m.rotation.set(...r); envScene.add(m);
    });

    const cubeRT = new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBAFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 50, cubeRT);
    cubeCamera.update(renderer, envScene);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd, metalness: 1.0, roughness: 0.03,
      envMap: cubeRT.texture, envMapIntensity: 2.5,
    });

    scene.add(new THREE.AmbientLight(0x111111, 0.2));
    ([
      [0xfff5e6, 0.6, [4, 5, 8]],
      [0xe6eeff, 0.3, [-5, 2, 7]],
      [0xffffff, 0.5, [0, -4, -6]],
      [0xff6633, 0.15, [8, 4, 3]],
      [0x33aacc, 0.12, [-8, -2, 3]],
    ] as [number, number, [number, number, number]][]).forEach(([c, i, p]) => {
      const l = new THREE.PointLight(c, i, 30);
      l.position.set(...p);
      scene.add(l);
    });

    // === FONT → 3D GEOMETRY ===
    function glyphPathToShapes(glyphPath: any, scale: number) {
      const contours: any[][] = [];
      let cur: any[] | null = null;
      glyphPath.commands.forEach((cmd: any) => {
        if (cmd.type === "M") { cur = []; contours.push(cur); }
        if (cur) cur.push(cmd);
      });

      const processed = contours.map(cmds => {
        const path = new THREE.Path();
        cmds.forEach((c: any) => {
          if (c.type === "M") path.moveTo(c.x * scale, -c.y * scale);
          else if (c.type === "L") path.lineTo(c.x * scale, -c.y * scale);
          else if (c.type === "Q") path.quadraticCurveTo(c.x1 * scale, -c.y1 * scale, c.x * scale, -c.y * scale);
          else if (c.type === "C") path.bezierCurveTo(c.x1 * scale, -c.y1 * scale, c.x2 * scale, -c.y2 * scale, c.x * scale, -c.y * scale);
        });
        const pts = path.getPoints(48);
        const cw = THREE.ShapeUtils.isClockWise(pts);
        return { path, pts, isOuter: cw };
      });

      const outers = processed.filter(p => p.isOuter);
      const holes = processed.filter(p => !p.isOuter);
      const src = outers.length === 0 ? processed.filter(p => !p.isOuter) : outers;
      const hSrc = outers.length === 0 ? processed.filter(p => p.isOuter) : holes;

      return src.map(o => {
        const shape = new THREE.Shape(o.pts);
        const oBB = new THREE.Box2();
        o.pts.forEach((pt: THREE.Vector2) => oBB.expandByPoint(pt));
        hSrc.forEach(h => {
          if (h.pts.length > 1) {
            let cx = 0, cy = 0;
            h.pts.forEach((pt: THREE.Vector2) => { cx += pt.x; cy += pt.y; });
            cx /= h.pts.length; cy /= h.pts.length;
            if (oBB.containsPoint(new THREE.Vector2(cx, cy))) {
              shape.holes.push(new THREE.Path(h.pts));
            }
          }
        });
        return shape;
      });
    }

    let group: THREE.Group | null = null;
    let animId: number;

    // Decode base64 font and parse with opentype
    const binary = atob(FONT_B64);
    const buf = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);

    try {
      const font = (opentype as any).parse(buf);
      group = new THREE.Group();
      const fontSize = 800;
      const scale = 1 / 150;
      let xCursor = 0;

      for (let i = 0; i < 4; i++) {
        const ch = "2026"[i];
        const glyph = font.charToGlyph(ch);
        const glyphPath = glyph.getPath(xCursor, 0, fontSize);
        const shapes = glyphPathToShapes(glyphPath, scale);
        shapes.forEach((shape: THREE.Shape) => {
          const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.85, bevelEnabled: true,
            bevelThickness: 0.04, bevelSize: 0.04,
            bevelSegments: 3, curveSegments: 48,
          });
          group!.add(new THREE.Mesh(geo, chromeMat));
        });
        xCursor += glyph.advanceWidth * (fontSize / font.unitsPerEm);
      }

      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);
      scene.add(group);
    } catch (e) {
      console.error("Chrome2026 font error:", e);
    }

    // === MOUSE ===
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // === RESIZE ===
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

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (group) {
        const s = scaleRef.current;
        group.scale.set(s, s, s * 0.73);
        group.rotation.y = Math.sin(t * 0.25) * 0.08 + mx * 0.12;
        group.rotation.x = Math.sin(t * 0.3) * 0.04 + my * 0.08;
        group.position.y = Math.sin(t * 0.4) * 0.06;
      }

      envFrame++;
      if (envFrame % 90 === 0) {
        envScene.children.forEach((child, i) => {
          if (i < 10) {
            child.rotation.z += 0.015;
            child.position.y += Math.sin(t * 0.08 + i) * 0.03;
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
      chromeMat.dispose();
      cubeRT.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
