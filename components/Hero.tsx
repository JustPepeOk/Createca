"use client";

import { useRef, useEffect, useState } from "react";
import DataVortex, { VortexParams } from "./DataVortex";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CSS_VORTEX = `
@keyframes vortex-spin-a { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes vortex-spin-b { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes vortex-spin-c { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes vortex-pulse  { 0%,100%{opacity:.7} 50%{opacity:1} }
.mv-wrap{position:absolute;inset:0;overflow:hidden;display:flex;align-items:center;justify-content:center}
.mv-ring{position:absolute;border-radius:50%;border-style:solid}
.mv-r1{width:85vw;height:85vw;border-width:1px;border-color:rgba(255,80,20,.35);animation:vortex-spin-a 6s linear infinite}
.mv-r2{width:68vw;height:68vw;border-width:1px;border-color:rgba(255,60,10,.25);animation:vortex-spin-b 9s linear infinite}
.mv-r3{width:54vw;height:54vw;border-width:2px;border-color:rgba(200,40,10,.3);animation:vortex-spin-a 12s linear infinite}
.mv-r4{width:40vw;height:40vw;border-width:1px;border-color:rgba(30,80,200,.25);animation:vortex-spin-b 7s linear infinite}
.mv-r5{width:26vw;height:26vw;border-width:2px;border-color:rgba(20,60,180,.35);animation:vortex-spin-c 5s linear infinite}
.mv-glow{position:absolute;width:60vw;height:60vw;border-radius:50%;background:radial-gradient(circle,rgba(180,40,10,.18) 0%,rgba(10,30,120,.12) 50%,transparent 70%);animation:vortex-pulse 4s ease-in-out infinite}
.mv-dot{position:absolute;width:4px;height:4px;border-radius:50%;background:#ff5010;top:0;left:50%;transform:translateX(-50%)}
`;

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const vortexRef = useRef<VortexParams>({
    innerR: 0.74, outerR: 1.56, genIn: 0.10, genOut: 0.25, speed: 0.080, mouse: 0.030,
  });
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef    = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
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
          onLeave: () => window.dispatchEvent(new Event("hero-done")),
          onEnterBack: () => window.dispatchEvent(new Event("hero-back")),
        },
      });

      // Phase 1 — logo + texto + botón desaparecen (0–30%)
      tl.to(contentRef.current, {
        autoAlpha: 0,
        duration: 0.30,
        ease: "power2.in",
      }, 0);

      // Phase 2 — zoom hacia adentro del vórtice (20–100%)
      tl.to(canvasWrapRef.current, {
        scale: 7,
        duration: 1.0,
        ease: "power2.in",
      }, 0.18);

      // Animar los uniforms del shader en paralelo: el ring se expande y la corona desaparece
      tl.to(vortexRef.current, {
        innerR: 0.03,
        outerR: 4.0,
        genIn:  0.03,
        genOut: 1.2,
        speed:  0.025,
        duration: 1.0,
        ease: "power2.in",
      }, 0.18);

      // Phase 3 — overlay negro entra (75–100%)
      tl.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.30,
        ease: "power1.in",
      }, 0.72);


    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen bg-carbon overflow-hidden"
    >
      {isMobile && <style dangerouslySetInnerHTML={{ __html: CSS_VORTEX }} />}

      {/* Vórtice — desktop: WebGL canvas / mobile: CSS rings */}
      <div
        ref={canvasWrapRef}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%" }}
      >
        {isMobile ? (
          <div className="mv-wrap">
            <div className="mv-glow" />
            <div className="mv-ring mv-r1"><div className="mv-dot" /></div>
            <div className="mv-ring mv-r2"><div className="mv-dot" /></div>
            <div className="mv-ring mv-r3"><div className="mv-dot" /></div>
            <div className="mv-ring mv-r4"><div className="mv-dot" /></div>
            <div className="mv-ring mv-r5"><div className="mv-dot" /></div>
          </div>
        ) : (
          <DataVortex paramsRef={vortexRef} />
        )}
      </div>

      {/* Contenido */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ transform: isMobile ? "translateY(0)" : "translateY(74px)", paddingBottom: "9vh", gap: 0 }}
      >
        <div style={{ width: '100%', maxWidth: 561, marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_blanco.svg" alt="CREATECA" className="w-full" />
        </div>

        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 15,
          opacity: 0.60,
          color: "#F5F2EB",
          maxWidth: "20rem",
          marginBottom: 15,
        }}>
          La creatividad sin estructura es solo ruido.
        </p>

        <div className="w-full sm:w-auto">
          <a
            href="#contacto"
            onClick={e => {
              e.preventDefault();
              document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 14,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              paddingLeft: 32,
              paddingRight: 32,
              paddingTop: 12,
              paddingBottom: 12,
              border: "1px solid #931818",
              color: "#931818",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Abrir un expediente
          </a>
        </div>
      </div>

      {/* Overlay negro — cubre todo al final del scroll */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#090909",
          opacity: 0,
          visibility: "hidden",
          zIndex: 30,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
