"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import BracketsScene from "./BracketsScene";

export default function Manifiesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-carbon py-28 px-6 relative overflow-hidden">

      {/* 3D brackets — fill the full section behind the text */}
      <BracketsScene />

      {/* Content on top */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs md:text-sm text-orange tracking-[0.3em] uppercase">
            EL MANIFIESTO
          </span>
          <div className="flex-1 h-px bg-ghost/10" />
        </motion.div>

        <motion.h2
          className="font-mono text-xl sm:text-2xl md:text-3xl text-ghost leading-tight mb-8 text-left"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          La creatividad no es un impulso.
          <br />
          <span className="text-ghost/60">
            Es un sistema de preservación estratégica.
          </span>
        </motion.h2>

        <motion.div
          className="space-y-5 font-sans text-sm text-ghost/70 leading-relaxed text-left"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
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
          <p className="font-mono text-xs text-ghost/40 tracking-widest pt-2">
            — CREATECA, 2026
          </p>
        </motion.div>

      </div>
    </section>
  );
}
