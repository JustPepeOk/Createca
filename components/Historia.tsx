"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const entries = [
  {
    year: "2016",
    label: "FUNDACIÓN",
    desc: "Constitución formal de la agencia. Primeros clientes en branding e identidad visual para marcas de consumo en México.",
  },
  {
    year: "2020",
    label: "PAUSA",
    desc: "Reconfiguración estratégica. Periodo de análisis, documentación interna y redefinición del modelo operativo.",
  },
  {
    year: "2026",
    label: "RENACIMIENTO",
    desc: "Reactivación con nuevo posicionamiento. Enfoque en proyectos de alto impacto y desarrollo de marca sistémico.",
  },
];

export default function Historia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-carbon py-20 px-6 border-t border-ghost/5">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[10px] text-ghost/30 tracking-[0.4em] uppercase">
            Registro cronológico
          </span>
          <div className="flex-1 h-px bg-ghost/5" />
        </motion.div>

        {/* Timeline grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-ghost/10">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.year}
              className="px-0 md:px-8 first:pl-0 last:pr-0 py-6 md:py-0"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-3xl text-ghost/20">{entry.year}</span>
                <span className="font-mono text-[10px] text-orange tracking-[0.3em]">
                  — {entry.label}
                </span>
              </div>
              <p className="font-sans text-xs text-ghost/50 leading-relaxed">
                {entry.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
