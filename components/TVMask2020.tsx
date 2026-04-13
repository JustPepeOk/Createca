"use client";

import { useEffect, useRef, CSSProperties } from "react";

export default function TVMask2020({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    const video   = videoRef.current;
    if (!wrapper || !canvas || !video) return;

    let animId: number;

    const setSize = () => {
      canvas.width  = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
    };
    setSize();

    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      if (video.readyState < 2) return;

      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw video frame (TV noise)
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(video, 0, 0, w, h);

      // 2. Clip to "2020" text shape using destination-in
      ctx.globalCompositeOperation = "destination-in";
      const fontSize = Math.floor(h * 0.88);
      ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("2020", w / 2, h / 2);

      ctx.globalCompositeOperation = "source-over";
    };

    const start = () => {
      video.play().catch(() => {});
      draw();
    };

    // Loop only the first 59 s to avoid watermark/outro
    const LOOP_END = 59;
    const onTimeUpdate = () => {
      if (video.currentTime >= LOOP_END) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    document.fonts.ready.then(() => {
      if (video.readyState >= 2) {
        start();
      } else {
        video.addEventListener("canplay", start, { once: true });
      }
    });

    const ro = new ResizeObserver(setSize);
    ro.observe(wrapper);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", ...style }}>
      <video
        ref={videoRef}
        src="/tv-noise.mp4"
        muted loop playsInline preload="auto"
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
