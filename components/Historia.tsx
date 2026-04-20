"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BracketsScene from "./BracketsScene";

gsap.registerPlugin(ScrollTrigger);

const epochs = [
  {
    year: "2012",
    img: "/72ppi/2012@72x.png",
    label: "FUNDACIÓN",
    desc: "Constitución formal de la agencia. Primeros clientes en branding e identidad visual para marcas de consumo en México.",
  },
  {
    year: "2020",
    img: "/72ppi/2020@72x.png",
    label: "PAUSA",
    desc: "Reconfiguración estratégica. Periodo de análisis, documentación interna y redefinición del modelo operativo.",
  },
  {
    year: "2026",
    img: "/72ppi/2026@72x.png",
    label: "RENACIMIENTO",
    desc: "Reactivación con nuevo posicionamiento. Enfoque en proyectos de alto impacto y desarrollo de marca sistémico.",
    active: true,
  },
];

const PANELS = 1 + epochs.length;

export default function Historia() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    gsap.set(wrapper, { autoAlpha: 0 });

    let initialized = false;
    const onHeroDone = () => { if (initialized) gsap.to(wrapper, { autoAlpha: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" }); };
    const onHeroBack = () => { if (initialized) gsap.to(wrapper, { autoAlpha: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" }); };

    window.addEventListener("hero-done", onHeroDone);
    window.addEventListener("hero-back", onHeroBack);

    let raf2 = 0;
    const raf = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const vw = window.innerWidth;

        // Carousel scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top top",
            end: () => "+=" + epochs.length * window.innerHeight,
            scrub: 1.4,
          },
        });
        tl.fromTo(track, { x: 0 }, { x: -(epochs.length * vw), ease: "none", duration: epochs.length }, 0);

        // Push físico: Historia sube en sync 1:1 con Servicios entrando
        gsap.timeline({
          scrollTrigger: {
            trigger: "#servicios",
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }).fromTo(wrapper, { yPercent: 0 }, { yPercent: -100, ease: "none" });

        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
        initialized = true;
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      window.removeEventListener("hero-done", onHeroDone);
      window.removeEventListener("hero-back", onHeroBack);
    };
  }, []);

  return (
    <>
      {/* 500vh: 300vh carrusel + 100vh dwell + 100vh para que el push tenga punto de entrada */}
      <div ref={spacerRef} style={{ height: `${(epochs.length + 2) * 100}vh` }} />

      <div
        ref={wrapperRef}
        style={{ position: "fixed", inset: 0, zIndex: 35, overflow: "hidden", background: "#090909" }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", width: `${PANELS * 100}vw`, height: "100%" }}
        >

          {/* Panel 0: Manifiesto */}
          <div
            style={{ width: "100vw", height: "100%", flexShrink: 0, position: "relative" }}
            className="flex items-center justify-center overflow-hidden"
          >
            <BracketsScene />
            <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
              <div className="flex items-center gap-4 mb-12">
                <span className="font-mono text-sm text-orange tracking-[0.3em] uppercase">
                  EL MANIFIESTO
                </span>
                <div className="flex-1 h-px bg-ghost/15" />
              </div>
              <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl text-ghost leading-tight mb-10 text-left">
                La creatividad no es un impulso.
                <br />
                <span className="text-ghost/50">
                  Es un sistema de preservación estratégica.
                </span>
              </h2>
              <div className="space-y-6 font-sans text-base text-ghost/75 leading-relaxed text-left">
                <p>
                  Vivimos en un momento donde todo comunica y nada permanece. Las marcas
                  se construyen en segundos y colapsan en menos tiempo. La velocidad se
                  confundió con relevancia. El ruido, con presencia.
                </p>
                <p>
                  CREATECA nace de la convicción de que el verdadero diferencial no está
                  en el impulso creativo —está en la arquitectura que lo sostiene. Una
                  marca que dura no es la que grita más fuerte. Es la que tiene estructura,
                  coherencia y visión de largo plazo.
                </p>
                <p>
                  Operamos en la intersección de la estrategia y la creación. No hacemos
                  diseño por estética ni marketing por volumen. Construimos sistemas que
                  le dan forma a las ideas y dirección a las marcas que quieren perdurar.
                </p>
                <p className="font-mono text-xs text-ghost/35 tracking-widest pt-2">
                  — CREATECA, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Panels 1-3: Epochs */}
          {epochs.map((epoch, i) => (
            <div
              key={epoch.year}
              style={{ width: "100vw", height: "100%", flexShrink: 0, position: "relative" }}
            >
              {/* Orbe de transición: solo en 2026, simula que el orbe de Servicios ya está ahí */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={epoch.img}
                alt={epoch.year}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -52%)",
                  width: "90vw",
                  height: "auto",
                  opacity: epoch.active ? 0.95 : 0.5,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{ position: "absolute", bottom: "10vh", left: "clamp(24px, 5vw, 80px)" }}
              >
                <span className="font-mono text-sm text-ghost/40 tracking-[0.3em] uppercase block mb-4">
                  {String(i + 1).padStart(2, "0")} / {String(epochs.length).padStart(2, "0")}
                </span>
                <span className={`font-mono text-2xl tracking-[0.2em] uppercase block mb-4 ${
                  epoch.active ? "text-orange" : "text-ghost/70"
                }`}>
                  — {epoch.label}
                </span>
                <p className="font-sans text-base leading-relaxed text-ghost/75 max-w-md">
                  {epoch.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
