"use client";

import Link from "next/link";
import HeroShader from "./HeroShader";

const TICKER_TEXT =
  "CREATIVITY / THROUGH / IRREGULAR / VISION · STRATEGIC MARKETING · VISUAL IDENTITY · DISRUPTIVE PROJECTS · MÉXICO · 2026 · ";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-carbon overflow-hidden">

      {/* ── Shader background ── */}
      <HeroShader />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6
                      pb-[30vh] md:pb-[38vh]">

        {/* Logo */}
        <div className="hero-logo w-56 sm:w-72 md:w-[480px] lg:w-[580px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_blanco.svg" alt="CREATECA" className="w-full" />
        </div>

        {/* Manifesto */}
        <p className="hero-manifesto font-sans text-sm text-ghost/60 max-w-xs">
          La creatividad sin estructura es solo ruido.
        </p>

        {/* CTA */}
        <div className="hero-cta w-full sm:w-auto">
          <Link
            href="/contacto"
            className="block sm:inline-block font-mono text-xs tracking-[0.25em] uppercase px-8 py-3 border border-orange text-orange hover:bg-orange hover:text-ghost transition-all duration-200"
          >
            Abrir un expediente
          </Link>
        </div>
      </div>

      {/* ── Hands ── */}
      {/* Mobile: smaller, no offsets, centered gap */}
      {/* Desktop: larger with fine-tuned offsets */}
      {/* Mobile: both anchored absolute bottom-0 */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "28vh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/adan.png"       alt="" className="hand-adan absolute bottom-0 left-0 h-[28vh] w-auto" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dios_cromo.png" alt="" className="hand-dios absolute bottom-0 right-0 h-[28vh] w-auto" />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 items-end justify-between pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adan.png"
          alt=""
          className="hand-adan block w-auto"
          style={{ height: "34vh", marginLeft: "-14px", marginBottom: "169px" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dios_cromo.png"
          alt=""
          className="hand-dios block w-auto"
          style={{ height: "45vh", marginRight: "-77px", marginBottom: "18vh" }}
        />
      </div>

      {/* ── Ticker — desktop only ── */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 border-t border-ghost/10 bg-carbon/80 overflow-hidden">
        <div className="py-2.5 overflow-hidden">
          <span className="hero-ticker font-mono text-[10px] tracking-[0.25em] text-ghost/40 whitespace-nowrap uppercase">
            {TICKER_TEXT.repeat(4)}
          </span>
        </div>
      </div>
    </section>
  );
}
