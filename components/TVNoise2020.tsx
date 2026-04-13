"use client";

import { useEffect, useRef, CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function TVNoise2020({ className = "", style }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    // Render at 1/4 resolution — chunky pixel look, authentic TV static
    const SCALE = 4;
    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width  = Math.max(1, Math.floor(wrapper.clientWidth  / SCALE));
      canvas.height = Math.max(1, Math.floor(wrapper.clientHeight / SCALE));
    };
    resize();

    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frame++;
      // ~24fps — authentic TV cadence
      if (frame % 3 !== 0) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w < 1 || h < 1) return;

      const img  = ctx.createImageData(w, h);
      const data = img.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() < 0.08
          ? 255                          // hot pixel
          : Math.floor(Math.random() * 160); // general static
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(img, 0, 0);

      // Horizontal scanline burn — every other row darker
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      for (let y = 1; y < h; y += 2) {
        ctx.fillRect(0, y, w, 1);
      }
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          display: "block",
          opacity: 0.85,
        }}
      />
    </div>
  );
}
