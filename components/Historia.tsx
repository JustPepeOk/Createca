"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import TVMask2020 from "./TVMask2020";
import Chrome2026  from "./Chrome2026";

const YEAR_H = "clamp(80px, 13vw, 200px)";

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

  const [desktop, setDesktop] = useState(false);
  useEffect(() => { setDesktop(window.innerWidth >= 768); }, []);

  const a = (opts: { y?: number; x?: number; scale?: boolean; delay?: number } = {}) =>
    desktop
      ? {
          initial: { opacity: 0, y: opts.y ?? 0, x: opts.x ?? 0, scale: opts.scale ? 0 : undefined },
          whileInView: { opacity: 1, y: 0, x: 0, scale: opts.scale ? 1 : undefined },
          viewport: { once: true, margin: "0px" },
          transition: { duration: 0.6, delay: opts.delay ?? 0 },
        }
      : { initial: false as const };

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineWidth  = useTransform(scrollYProgress, [0.1, 0.7],  ["0%", "100%"]);
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.75], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="bg-[#002147] overflow-hidden border-t border-ghost/5 timeline-grain relative">

      {/* ── DESKTOP ── */}
      <div className="hidden md:block relative z-10">

        <motion.div
          className="flex items-center gap-3 px-16 pt-12 pb-6"
          {...a({ y: 8 })}
        >
          <span className="font-mono text-xs text-ghost tracking-[0.3em] uppercase">
            Registro cronológico
          </span>
          <div className="w-5 h-px bg-ghost/40" />
        </motion.div>

        <div className="flex items-end px-16 select-none" style={{ height: YEAR_H }} aria-hidden>

          <motion.div className="flex-1 flex justify-center items-end h-full" {...a({ y: 20, delay: 0.05 })}>
            <span style={{
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "clamp(40px, 6vw, 120px)",
              color: "#F5F2EB",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              2016
            </span>
          </motion.div>

          <div className="self-stretch w-px bg-ghost/[0.07]" />

          <motion.div className="flex-1 flex justify-center items-end h-full" {...a({ delay: 0.18 })}>
            <div style={{ transform: "translateY(20px)", width: "100%" }}>
              <TVMask2020 style={{ width: "100%", height: "clamp(40px, 9vw, 180px)" }} />
            </div>
          </motion.div>

          <div className="self-stretch w-px bg-ghost/[0.07]" />

          <motion.div className="flex-1 flex justify-center items-end h-full" {...a({ y: 20, delay: 0.26 })}>
            <div style={{ transform: "translateY(87px)", width: "100%" }}>
              <Chrome2026 style={{ width: "100%", height: YEAR_H }} scale={1.2} />
            </div>
          </motion.div>

        </div>

        {/* Progress rail */}
        <div className="relative mx-16 mt-2">
          <div className="h-[2px] bg-ghost/10 w-full" />
          <motion.div
            className="absolute top-0 left-0 h-[2px] origin-left"
            style={{
              width: lineWidth,
              background: "linear-gradient(90deg,#3a3a3a 0%,#931818 50%,#DFA11D 100%)",
              filter: "drop-shadow(0 0 4px rgba(223,161,29,0.35))",
            }}
          />
          <div className="absolute top-0 left-0 w-full flex justify-between" style={{ transform: "translateY(-50%)" }}>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.year}
                className="relative flex items-center justify-center"
                {...a({ scale: true, delay: 0.3 + i * 0.15 })}
              >
                <div className={`rounded-full border ${
                  entry.active
                    ? "w-3 h-3 bg-orange border-orange shadow-[0_0_12px_rgba(223,161,29,0.7)]"
                    : "w-2 h-2 bg-[#002147] border-ghost/25"
                }`} />
                {entry.active && (
                  <motion.div
                    className="absolute w-3 h-3 rounded-full border border-orange"
                    animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="grid grid-cols-3 px-16 mt-6 pb-20">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.year}
              className={[
                i === 1 ? "border-l border-ghost/[0.06] px-8" : "",
                i === 2 ? "border-l border-ghost/[0.06] pl-8" : "",
                i === 0 ? "pr-8" : "",
              ].join(" ")}
              {...a({ y: 10, delay: 0.4 + i * 0.15 })}
            >
              <span className={`font-mono text-xs tracking-[0.3em] uppercase ${
                entry.active ? "text-orange" : "text-ghost"
              }`}>
                — {entry.label}
              </span>
              <p className="font-sans text-sm leading-relaxed mt-3 text-ghost/80">
                {entry.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden relative z-10 pt-10 pb-20">

        <div className="flex items-center gap-3 mb-10 px-5">
          <span className="font-mono text-xs text-ghost tracking-[0.3em] uppercase">
            Registro cronológico
          </span>
          <div className="w-4 h-px bg-ghost/40" />
        </div>

        <div className="absolute left-5 top-24 bottom-20 w-px bg-ghost/10" />
        <motion.div
          className="absolute left-5 top-24 w-px origin-top"
          style={{ height: lineHeight, background: "linear-gradient(180deg,#3a3a3a 0%,#931818 50%,#DFA11D 100%)", filter: "drop-shadow(0 0 3px rgba(223,161,29,0.3))" }}
        />

        <div className="flex flex-col gap-12">
          {entries.map((entry, i) => (
            <div
              key={entry.year}
              className="flex items-start"
              style={{ paddingLeft: "20px", gap: "16px" }}
            >
              <div className="relative flex-shrink-0 mt-2" style={{ width: 10 }}>
                <div className={`rounded-full border ${
                  entry.active ? "w-3 h-3 bg-orange border-orange shadow-[0_0_10px_rgba(223,161,29,0.7)]" : "w-2 h-2 bg-[#002147] border-ghost/25"
                }`} style={{ marginLeft: "-1px" }} />
                {entry.active && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-orange"
                    animate={{ scale: [1, 2.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>

              <div className="flex-1 pr-5">
                {entry.year === "2016" && (
                  <span style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "clamp(22px, 7vw, 40px)",
                    color: "#F5F2EB",
                    display: "block",
                    lineHeight: 1.2,
                    marginBottom: 12,
                  }}>
                    2016
                  </span>
                )}
                {entry.year === "2020" && (
                  <TVMask2020 style={{ width: "100%", height: "clamp(50px, 16vw, 80px)", marginBottom: 12 }} />
                )}
                {entry.year === "2026" && (
                  <Chrome2026 style={{ width: "100%", height: "clamp(50px, 16vw, 80px)", marginBottom: 12 }} scale={1.2} />
                )}

                <span className={`font-mono text-xs tracking-[0.3em] uppercase block mb-2 ${
                  entry.active ? "text-orange" : "text-ghost"
                }`}>
                  — {entry.label}
                </span>
                <p className="font-sans text-sm leading-relaxed text-ghost/80">
                  {entry.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
