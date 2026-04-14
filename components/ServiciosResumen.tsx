"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [desktop, setDesktop] = useState(false);
  useEffect(() => { setDesktop(window.innerWidth >= 768); }, []);

  const a = (delay = 0) => desktop
    ? { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "0px" }, transition: { duration: 0.5, delay } }
    : { initial: false as const };

  return (
    <section className="bg-carbon py-16 md:py-24 px-5 md:px-16 border-t border-ghost/5">

      <motion.div className="flex items-center gap-4 mb-12 md:mb-16" {...a(0)}>
        <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
          Catálogo de servicios
        </span>
        <div className="flex-1 h-px bg-ghost/10" />
      </motion.div>

      <div>
        {servicios.map((s, i) => (
          <motion.div
            key={s.num}
            className="relative group border-b border-ghost/[0.08] py-10 md:py-14"
            {...a(0.08 + i * 0.1)}
          >
            {/* Fila superior: número + tags + link */}
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-orange tracking-[0.3em]">[{s.num}]</span>
                <div className="w-8 h-px bg-ghost/15" />
                <span className="font-mono text-[10px] text-ghost/25 tracking-[0.25em] uppercase">
                  {s.tags.join(" · ")}
                </span>
              </div>
              <Link
                href="/servicios"
                className="font-mono text-[10px] text-ghost/20 hover:text-orange transition-colors duration-200 tracking-[0.2em] uppercase group-hover:text-orange/60"
              >
                Abrir expediente →
              </Link>
            </div>

            {/* Nombre del servicio */}
            <h3 className="font-mono text-2xl md:text-[clamp(28px,3.5vw,52px)] text-ghost leading-tight tracking-wide mb-5 md:mb-6">
              <span className="text-orange mr-3 md:mr-4">—</span>{s.nombre}
            </h3>

            {/* Descripción */}
            <div className="md:pl-[calc(1.5rem+16px)]">
              <p className="font-sans text-sm text-ghost/50 leading-relaxed max-w-2xl group-hover:text-ghost/70 transition-colors duration-300">
                {s.desc}
              </p>
            </div>

            {/* Línea naranja izquierda en hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
          </motion.div>
        ))}
      </div>

    </section>
  );
}
