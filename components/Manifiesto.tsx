"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Manifiesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-carbon py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
            EL MANIFIESTO
          </span>
          <div className="flex-1 h-px bg-ghost/10" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-mono text-xl sm:text-2xl md:text-3xl text-ghost leading-tight mb-10"
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

        {/* Decorative bracket */}
        <motion.div
          className="font-mono text-7xl text-ghost/5 leading-none mb-6 select-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          aria-hidden
        >
          [
        </motion.div>

        {/* Manifiesto body */}
        <motion.div
          className="space-y-5 font-sans text-sm text-ghost/70 leading-relaxed"
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

        {/* Closing bracket */}
        <motion.div
          className="font-mono text-7xl text-ghost/5 leading-none mt-4 text-right select-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          aria-hidden
        >
          ]
        </motion.div>
      </div>
    </section>
  );
}
