"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const certs = [
  { num: "01", name: "Google Analytics 4 Certified",  issuer: "Google",   year: "2024" },
  { num: "02", name: "Meta Business Partner",          issuer: "Meta",     year: "2023" },
  { num: "03", name: "HubSpot Marketing Certified",    issuer: "HubSpot",  year: "2024" },
  { num: "04", name: "Adobe Creative Suite Expert",    issuer: "Adobe",    year: "2023" },
  { num: "05", name: "Google Ads Search Certified",    issuer: "Google",   year: "2024" },
  { num: "06", name: "LinkedIn Marketing Labs",        issuer: "LinkedIn", year: "2023" },
];

export default function Certificaciones() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => { setDesktop(window.innerWidth >= 768); }, []);

  const a = (y = 12, delay = 0) => desktop
    ? { initial: { opacity: 0, y }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } }
    : { initial: false as const };

  return (
    <section className="bg-ghost py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <motion.div className="flex items-center gap-4 mb-4" {...a(12, 0)}>
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-carbon/40">
            CERTIFICACIONES
          </span>
          <div className="flex-1 h-px bg-carbon/15" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-sm text-carbon/45 mb-14"
          {...a(8, 0.1)}
        >
          Estándares que respaldan nuestra práctica.
        </motion.p>

        {/* Certification rows */}
        <div>
          {certs.map((cert, i) => (
            <motion.div
              key={cert.num}
              {...a(10, 0.1 + i * 0.08)}
            >
              {/* Divider above first row */}
              {i === 0 && <div className="h-px bg-carbon/10" />}

              <motion.div
                className="group flex items-center gap-6 py-5 px-3 -mx-3 transition-colors duration-200 hover:bg-carbon/[0.03]"
              >
                {/* Index number */}
                <span className="font-mono text-[10px] tracking-[0.2em] text-orange/60 group-hover:text-orange transition-colors duration-200 flex-shrink-0 w-8">
                  [{cert.num}]
                </span>

                {/* Cert name */}
                <span className="font-mono text-sm sm:text-base font-bold text-carbon uppercase tracking-[0.05em] flex-1">
                  {cert.name}
                </span>

                {/* Issuer + year */}
                <span className="font-mono text-[10px] text-carbon/35 tracking-[0.2em] uppercase flex-shrink-0">
                  {cert.issuer} · {cert.year}
                </span>
              </motion.div>

              {/* Divider below each row */}
              <div className="h-px bg-carbon/10" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
