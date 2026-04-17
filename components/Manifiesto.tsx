"use client";

import { useEffect, useRef } from "react";
import BracketsScene from "./BracketsScene";
import { gsap } from "gsap";

export default function Manifiesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.set(sectionRef.current, { autoAlpha: 0 });

    const onEnter = () => gsap.to(sectionRef.current, { autoAlpha: 1, duration: 0.8, ease: "power2.out", overwrite: true });
    const onLeave = () => gsap.to(sectionRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.in", overwrite: true });

    window.addEventListener("hero-done", onEnter);
    window.addEventListener("hero-back", onLeave);
    return () => {
      window.removeEventListener("hero-done", onEnter);
      window.removeEventListener("hero-back", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifiesto"
      className="bg-carbon px-6 overflow-hidden flex items-center justify-center"
      style={{ position: "fixed", inset: 0, zIndex: 35 }}
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
    </section>
  );
}
