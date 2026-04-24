"use client";

import { useRef, useEffect } from "react";
import DataVortex, { VortexParams } from "./DataVortex";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const vortexRef = useRef<VortexParams>({
    innerR: 0.74, outerR: 1.56, genIn: 0.10, genOut: 0.25, speed: 0.080, mouse: 0.030,
  });

  const sectionRef    = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);

  // DESKTOP ONLY — mobile logic lives in inline <script> in layout.tsx (bypasses React hydration)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.4,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onLeave:     () => window.dispatchEvent(new Event("hero-done")),
          onEnterBack: () => window.dispatchEvent(new Event("hero-back")),
        },
      });
      tl.to(contentRef.current,    { autoAlpha: 0, duration: 0.30, ease: "power2.in" }, 0);
      tl.to(canvasWrapRef.current, { scale: 7,     duration: 1.0,  ease: "power2.in" }, 0.18);
      tl.to(vortexRef.current, {
        innerR: 0.03, outerR: 4.0, genIn: 0.03, genOut: 1.2, speed: 0.025,
        duration: 1.0, ease: "power2.in",
      }, 0.18);
      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.30, ease: "power1.in" }, 0.72);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen bg-carbon overflow-hidden"
    >
      {/* Video mobile — controlled by vanilla JS in layout.tsx */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src="/vortex-mobile-15s.mp4"
        autoPlay muted playsInline preload="auto"
        className="hero-video-mobile"
      />

      {/* Desktop WebGL canvas — CSS-hidden on mobile via hidden/md:block */}
      <div
        ref={canvasWrapRef}
        className="hidden md:block"
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", pointerEvents: "none" }}
      >
        <DataVortex paramsRef={vortexRef} />
      </div>

      <div
        ref={contentRef}
        id="hero-content"
        className="hero-content relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_blanco.svg" alt="CREATECA" className="hero-logo w-full" />
        <p className="hero-tagline">
          La creatividad sin estructura es solo ruido.
        </p>
        <a
          href="#contacto"
          className="hero-cta"
          onClick={e => {
            e.preventDefault();
            document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Abrir un expediente
        </a>
      </div>

      <div
        ref={overlayRef}
        id="hero-overlay"
        style={{
          position: "absolute", inset: 0,
          background: "#090909",
          opacity: 0, visibility: "hidden",
          zIndex: 30, pointerEvents: "none",
        }}
      />
    </section>
  );
}
