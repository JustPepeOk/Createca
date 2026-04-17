"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTACierre() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="bg-blue py-28 px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[10px] text-ghost/30 tracking-[0.5em] uppercase border-b border-ghost/10 pb-1">
            CREATECA · 2026
          </span>
        </motion.div>

        <motion.h2
          className="font-mono text-2xl sm:text-3xl md:text-4xl text-ghost leading-tight mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          We build vision.
          <br />
          <span className="text-ghost/50">Not just brands.</span>
        </motion.h2>

        <motion.p
          className="font-sans text-sm text-ghost/50 max-w-md mx-auto mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Si tu proyecto requiere estructura, dirección y ejecución — abre un expediente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link
            href="/contacto"
            className="inline-block font-mono text-xs tracking-[0.25em] uppercase px-10 py-4 bg-orange text-ghost hover:bg-sand hover:text-carbon transition-all duration-200"
          >
            Abrir un expediente
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
