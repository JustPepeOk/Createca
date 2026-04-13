"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const servicios = [
  {
    num: "01",
    nombre: "MARKETING ESTRATÉGICO",
    tags: ["Estrategia", "Posicionamiento"],
    desc: "Desarrollo de estrategias de comunicación y posicionamiento alineadas a los objetivos de negocio. Sin tácticas genéricas — solo arquitectura de marca con propósito.",
  },
  {
    num: "02",
    nombre: "IDENTIDAD VISUAL",
    tags: ["Branding", "Logo", "Sistema"],
    desc: "Construcción de sistemas de identidad visual coherentes y escalables. Del concepto al manual. Del logo al ecosistema completo de marca.",
  },
  {
    num: "03",
    nombre: "PROYECTOS DISRUPTIVOS",
    tags: ["Campañas", "Activaciones"],
    desc: "Campañas y activaciones que rompen el patrón de la categoría. Ejecuciones que generan conversación, no solo impresiones.",
  },
];

export default function ServiciosResumen() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-carbon py-28 px-6 border-t border-ghost/5">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
            Catálogo de servicios
          </span>
          <div className="flex-1 h-px bg-ghost/10" />
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ghost/5">
          {servicios.map((s, i) => (
            <motion.div
              key={s.num}
              className="bg-carbon p-8 flex flex-col gap-5 group"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
            >
              {/* Number */}
              <span className="font-mono text-xs text-ghost/20 tracking-widest">
                [{s.num}]
              </span>

              {/* Name */}
              <h3 className="font-mono text-sm text-ghost tracking-wider leading-tight">
                {s.nombre}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] text-ghost/30 tracking-wider border border-ghost/10 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="font-sans text-xs text-ghost/50 leading-relaxed flex-1">
                {s.desc}
              </p>

              {/* CTA */}
              <Link
                href="/servicios"
                className="font-mono text-xs text-orange hover:text-sand transition-colors duration-200 tracking-wider"
              >
                Ver más →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
