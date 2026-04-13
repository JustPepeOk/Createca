"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const servicios = [
  {
    num: "01",
    nombre: "MARKETING ESTRATÉGICO",
    tags: ["Estrategia", "Posicionamiento", "Comunicación"],
    descripcion: [
      "El marketing sin estrategia es gasto. El marketing con estrategia es inversión. Construimos el sistema de comunicación de tu marca desde sus cimientos: propósito, posicionamiento, audiencias, mensajes clave y canales.",
      "No partimos de tácticas — partimos de la estructura. Cada decisión de comunicación debe poder justificarse dentro de un sistema coherente que refuerce el posicionamiento de la marca a largo plazo.",
      "Desarrollamos estrategias de contenido, planes de medios, guías de tono y voz, y marcos de posicionamiento que le dan dirección a todos los puntos de contacto de la marca con su audiencia.",
    ],
    entregables: [
      "Diagnóstico de posicionamiento",
      "Mapa de audiencias y segmentación",
      "Estrategia de contenido y comunicación",
      "Guía de tono y voz de marca",
      "Plan de medios y canales",
    ],
  },
  {
    num: "02",
    nombre: "IDENTIDAD VISUAL",
    tags: ["Branding", "Logo", "Sistema visual", "Manual de marca"],
    descripcion: [
      "Una identidad visual no es un logotipo. Es un sistema completo de expresión gráfica que codifica los valores, el posicionamiento y la personalidad de una marca en un lenguaje visual coherente y escalable.",
      "Diseñamos desde el concepto hasta el manual. Cada decisión —tipografía, color, forma, proporción— responde a una lógica estratégica, no a una preferencia estética. El resultado es un sistema que funciona en todos los contextos y escala con la marca.",
      "Trabajamos marcas nuevas, rebrandings y extensiones de sistema. Si ya tienes una identidad, podemos auditarla, documentarla y hacerla crecer.",
    ],
    entregables: [
      "Auditoría de identidad existente (rebrands)",
      "Exploración conceptual y definición de dirección",
      "Diseño de logotipo y variantes",
      "Sistema tipográfico y paleta de color",
      "Manual de identidad visual",
      "Aplicaciones primarias (digital y print)",
    ],
  },
  {
    num: "03",
    nombre: "PROYECTOS DISRUPTIVOS",
    tags: ["Campañas", "Activaciones", "Lanzamientos"],
    descripcion: [
      "Algunas marcas necesitan más que consistencia — necesitan ruptura. Campañas que rompan el patrón de su categoría, activaciones que generen conversación real y lanzamientos que posicionen desde el primer día.",
      "Los proyectos disruptivos requieren una combinación de insight profundo, creatividad estructurada y ejecución impecable. No hacemos creatividad por sorpresa — hacemos creatividad con propósito estratégico.",
      "Desarrollamos el concepto, la narrativa, los materiales y la estrategia de distribución. Nos involucramos desde la idea hasta la medición de resultados.",
    ],
    entregables: [
      "Brief estratégico y definición de objetivos",
      "Concepto creativo y narrativa de campaña",
      "Materiales de campaña (digital, OOH, activaciones)",
      "Plan de distribución y amplificación",
      "Framework de medición y KPIs",
    ],
  },
];

function ServicioFicha({ s, i }: { s: typeof servicios[0]; i: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      className="border-t border-ghost/10 py-16"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.05 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: header */}
        <div className="lg:col-span-4">
          <span className="font-mono text-xs text-ghost/20 tracking-widest block mb-4">
            [{s.num}]
          </span>
          <h2 className="font-mono text-lg text-ghost tracking-wider leading-snug mb-5">
            {s.nombre}
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {s.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-ghost/30 tracking-wider border border-ghost/10 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Entregables */}
          <div>
            <span className="font-mono text-[10px] text-orange tracking-[0.3em] uppercase block mb-3">
              Entregables
            </span>
            <ul className="space-y-2">
              {s.entregables.map((e) => (
                <li key={e} className="font-mono text-xs text-ghost/40 tracking-wide flex items-start gap-2">
                  <span className="text-orange mt-0.5 shrink-0">—</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: description */}
        <div className="lg:col-span-8 space-y-4">
          {s.descripcion.map((p, pi) => (
            <p key={pi} className="font-sans text-sm text-ghost/60 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Servicios() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="min-h-screen bg-carbon pt-14">
      {/* Page header */}
      <div ref={headerRef} className="border-b border-ghost/10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
              Catálogo
            </span>
            <div className="h-px w-16 bg-ghost/10" />
          </motion.div>

          <motion.h1
            className="font-mono text-3xl sm:text-4xl md:text-5xl text-ghost tracking-wider mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            SERVICIOS
          </motion.h1>

          <motion.p
            className="font-sans text-sm text-ghost/40 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tres áreas de práctica. Un mismo principio: la creatividad como sistema, no como impulso.
          </motion.p>
        </div>
      </div>

      {/* Service list */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {servicios.map((s, i) => (
          <ServicioFicha key={s.num} s={s} i={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-ghost/10 bg-carbon px-6 py-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-ghost/30 tracking-widest mb-2 uppercase">
              ¿Tu proyecto encaja aquí?
            </p>
            <p className="font-sans text-sm text-ghost/60">
              Cuéntanos qué necesitas. Evaluamos sin compromiso.
            </p>
          </div>
          <Link
            href="/contacto"
            className="shrink-0 inline-block font-mono text-xs tracking-[0.25em] uppercase px-8 py-3 border border-orange text-orange hover:bg-orange hover:text-ghost transition-all duration-200"
          >
            Iniciar un proyecto
          </Link>
        </div>
      </div>
    </div>
  );
}
