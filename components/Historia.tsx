"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TVMask2020 from "./TVMask2020";
import Chrome2026  from "./Chrome2026";

const entries = [
  {
    year: "2016",
    label: "FUNDACIÓN",
    desc:  "Constitución formal de la agencia. Primeros clientes en branding e identidad visual para marcas de consumo en México.",
  },
  {
    year: "2020",
    label: "PAUSA",
    desc:  "Reconfiguración estratégica. Periodo de análisis, documentación interna y redefinición del modelo operativo.",
  },
  {
    year: "2026",
    label: "RENACIMIENTO",
    desc:  "Reactivación con nuevo posicionamiento. Enfoque en proyectos de alto impacto y desarrollo de marca sistémico.",
    active: true,
  },
];

export default function Historia() {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-80px" });

  const YEAR_H = "clamp(80px, 13vw, 200px)";

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineWidth  = useTransform(scrollYProgress, [0.1, 0.7],  ["0%", "100%"]);
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.75], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="bg-carbon overflow-hidden border-t border-ghost/5 timeline-grain relative">

      {/* Section label */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs md:text-sm text-ghost/30 tracking-[0.3em] uppercase">
            Registro cronológico
          </span>
          <div className="flex-1 h-px bg-ghost/5" />
        </motion.div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block relative z-10">

        {/* Year display row — all slots same height, items bottom-aligned */}
        <div className="flex items-end justify-between px-16 select-none" style={{ height: YEAR_H }} aria-hidden>

          {/* 2016 — pixel font */}
          <motion.div
            className="flex-1 flex justify-center items-end h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            <span style={{
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "clamp(40px, 6vw, 120px)",
              color: "#3a3a3a",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              2016
            </span>
          </motion.div>

          {/* 2020 — video masked to text */}
          <motion.div
            className="flex-1 flex justify-center items-end h-full"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <div style={{ transform: "translateY(20px)", width: "100%" }}>
              <TVMask2020 style={{ width: "100%", height: "clamp(40px, 9vw, 180px)" }} />
            </div>
          </motion.div>

          {/* 2026 — chrome 3D */}
          <motion.div
            className="flex-1 flex justify-center items-end h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.26 }}
          >
            <div style={{ transform: "translateY(87px)", width: "100%" }}>
              <Chrome2026 style={{ width: "100%", height: YEAR_H }} scale={1.2} />
            </div>
          </motion.div>

        </div>

        {/* Progress rail */}
        <div className="relative mx-16 mt-2">
          <div className="h-px bg-ghost/10 w-full" />
          <motion.div
            className="absolute top-0 left-0 h-px origin-left"
            style={{
              width: lineWidth,
              background: "linear-gradient(90deg,#3a3a3a 0%,#931818 50%,#DFA11D 100%)",
            }}
          />
          <div className="absolute top-0 left-0 w-full flex justify-between" style={{ transform: "translateY(-50%)" }}>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.year}
                className="relative flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                <div className={`w-2 h-2 rounded-full border ${
                  entry.active
                    ? "bg-orange border-orange shadow-[0_0_8px_rgba(147,24,24,0.8)]"
                    : "bg-carbon border-ghost/25"
                }`} />
                {entry.active && (
                  <motion.div
                    className="absolute w-2 h-2 rounded-full border border-orange"
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Labels + descriptions */}
        <div className="grid grid-cols-3 px-16 mt-6 pb-20">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.year}
              className={i < entries.length - 1 ? "pr-8" : ""}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            >
              <span className={`font-mono text-xs tracking-[0.3em] uppercase ${"labelStrike" in entry && entry.labelStrike ? "line-through decoration-ghost/30 text-ghost/25" : entry.active ? "text-orange" : "text-ghost/35"}`}>
                — {entry.label}
              </span>
              <p className={`font-sans text-sm leading-relaxed mt-3 ${entry.active ? "text-ghost/60" : "text-ghost/30"}`}>
                {entry.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden relative z-10 px-6 pt-10 pb-20">
        <div className="absolute left-[30px] top-10 bottom-20 w-px bg-ghost/10" />
        <motion.div
          className="absolute left-[30px] top-10 w-px origin-top"
          style={{ height: lineHeight, background: "linear-gradient(180deg,#3a3a3a 0%,#931818 50%,#DFA11D 100%)" }}
        />

        <div className="flex flex-col gap-14">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.year}
              className="flex gap-6 items-start"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.18 }}
            >
              {/* Dot */}
              <div className="relative flex-shrink-0 mt-3" style={{ width: 8 }}>
                <div className={`w-2 h-2 rounded-full border ${
                  entry.active ? "bg-orange border-orange shadow-[0_0_8px_rgba(147,24,24,0.8)]" : "bg-carbon border-ghost/25"
                }`} />
                {entry.active && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-orange"
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Year display */}
                {entry.year === "2016" && (
                  <span style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "clamp(18px, 5vw, 32px)",
                    color: "#3a3a3a",
                    display: "block",
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}>
                    2016
                  </span>
                )}
                {entry.year === "2020" && (
                  <TVMask2020 style={{ width: "100%", height: "clamp(40px, 10vw, 72px)", marginBottom: 10 }} />
                )}
                {entry.year === "2026" && (
                  <Chrome2026 style={{ width: "100%", height: "clamp(40px, 10vw, 72px)", marginBottom: 10 }} />
                )}

                <span className={`font-mono text-xs tracking-[0.3em] uppercase block mb-2 ${"labelStrike" in entry && entry.labelStrike ? "line-through decoration-ghost/30 text-ghost/25" : entry.active ? "text-orange" : "text-ghost/35"}`}>
                  — {entry.label}
                </span>
                <p className={`font-sans text-sm leading-relaxed ${entry.active ? "text-ghost/60" : "text-ghost/30"}`}>
                  {entry.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
