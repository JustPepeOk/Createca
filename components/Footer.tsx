"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

export default function Footer() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [showLanyard, setShowLanyard] = useState(false);

  const sectionRef     = useRef<HTMLDivElement>(null);
  const leftRef        = useRef<HTMLDivElement>(null);
  const rightRef       = useRef<HTMLDivElement>(null);
  const contentRef     = useRef<HTMLDivElement>(null);
  const lanyardWrapRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const left    = leftRef.current;
    const right   = rightRef.current;
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!left || !right || !content || !section) return;

    gsap.set(left,    { scaleX: 0, transformOrigin: "left center" });
    gsap.set(right,   { scaleX: 0, transformOrigin: "right center" });
    gsap.set(content, { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top 20%",
        scrub: 1,
      },
    });

    tl.to([left, right], {
      scaleX: 1,
      duration: 3,
      ease: "none",
    }).to(content, {
      autoAlpha: 1,
      y: 0,
      duration: 1.5,
      ease: "none",
    }, "-=0.5");

    const lanyardSt = ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      onEnter: () => {
        setShowLanyard(true);
        gsap.to(lanyardWrapRef.current, {
          autoAlpha: 1,
          duration: 0.5,
          delay: 0.1,
          ease: "power1.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(lanyardWrapRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setShowLanyard(false),
        });
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      lanyardSt.kill();
    };
  }, []);

  return (
    <footer id="contacto" style={{ position: "relative", zIndex: 20 }}>

      {/* ── MAIN SECTION ── */}
      <div
        ref={sectionRef}
        className="footer-main"
        style={{
          position: "relative",
          minHeight: "760px",
          background: "#090909",
          overflow: "hidden",
        }}
      >
        {/* Franja roja — izquierda */}
        <div ref={leftRef} className="footer-franja-l" style={{
          position: "absolute", inset: 0,
          width: "50%", left: 0,
          background: "#FF3C00",
        }} />

        {/* Franja roja — derecha */}
        <div ref={rightRef} className="footer-franja-r" style={{
          position: "absolute", inset: 0,
          width: "50%", right: 0, left: "auto",
          background: "#FF3C00",
        }} />

        {/* Contenido */}
        <div ref={contentRef} className="footer-content" style={{ position: "relative", zIndex: 10, display: "flex", minHeight: "760px" }}>

          {/* Lanyard */}
          <div ref={lanyardWrapRef} className="footer-lanyard absolute top-0 right-0 bottom-0" style={{ width: "50%", zIndex: 50, visibility: "hidden", opacity: 0 }}>
            {showLanyard && <Lanyard position={[0, 0, 9]} gravity={[0, -40, 0]} fov={24} transparent />}
          </div>

          <div className="footer-form-col" style={{ maxWidth: "50%", position: "relative", zIndex: 60, padding: "6rem 4rem 5rem" }}>
            <span style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "rgba(245,242,235,0.5)",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(245,242,235,0.2)",
              paddingBottom: "4px",
              display: "inline-block",
            }}>
              CREATECA · 2026
            </span>

            <h2 style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              fontWeight: 800,
              color: "#F5F2EB",
              lineHeight: 1.15,
              marginTop: "2rem",
              marginBottom: "1.25rem",
            }}>
              We build vision.
              <br />
              <span style={{ color: "rgba(245,242,235,0.45)" }}>Not just brands.</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-bahnschrift), Bahnschrift, sans-serif",
              fontSize: "0.875rem",
              color: "rgba(245,242,235,0.7)",
              marginBottom: "3rem",
            }}>
              Si tu proyecto requiere estructura, dirección y ejecución — abre un expediente.
            </p>

            <div style={{ height: "1px", background: "rgba(245,242,235,0.2)", marginBottom: "2.5rem" }} />

            {sent ? (
              <div style={{ padding: "3rem 0", textAlign: "center" }}>
                <p style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "0.875rem",
                  color: "rgba(245,242,235,0.6)",
                  letterSpacing: "0.15em",
                }}>
                  — Mensaje recibido. Te contactamos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="footer-input-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <Field label="Nombre">
                    <input type="text" required value={form.nombre}
                      onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                      placeholder="Tu nombre"
                      className="footer-input"
                      style={inputStyle} />
                  </Field>
                  <Field label="Email">
                    <input type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="footer-input"
                      style={inputStyle} />
                  </Field>
                </div>
                <Field label="Mensaje">
                  <textarea required rows={5} value={form.mensaje}
                    onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className="footer-input"
                    style={{ ...inputStyle, resize: "none" }} />
                </Field>
                <div>
                  <button type="submit" style={btnStyle}
                    onMouseEnter={e => Object.assign((e.target as HTMLElement).style, btnHover)}
                    onMouseLeave={e => Object.assign((e.target as HTMLElement).style, btnStyle)}>
                    Enviar mensaje →
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* ── CREDITS BAR ── */}
      <div style={{
        background: "#090909",
        borderTop: "1px solid rgba(245,242,235,0.05)",
        padding: "2rem 1.5rem",
      }}>
        <div style={{
          maxWidth: "1400px", margin: "0 auto",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: "1rem",
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/purologoblanco.svg" alt="CREATECA" style={{ height: "18px", width: "auto", opacity: 0.9 }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(245,242,235,0.4)", letterSpacing: "0.1em" }}>
            México · León
          </span>
          <span style={{ fontSize: "0.75rem", color: "rgba(245,242,235,0.2)", letterSpacing: "0.15em" }}>
            DEVELOPING BRAND THROUGH A NEW WORLD VISION
          </span>
        </div>
      </div>

    </footer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "10px",
        color: "rgba(245,242,235,0.8)",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.2)",
  border: "1px solid rgba(245,242,235,0.65)",
  padding: "0.75rem 1rem",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.875rem",
  color: "#F5F2EB",
  outline: "none",
  width: "100%",
};

const btnStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "11px",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "#F5F2EB",
  background: "none",
  border: "1px solid rgba(245,242,235,0.8)",
  padding: "1rem 2rem",
  cursor: "pointer",
  transition: "all 0.3s",
};

const btnHover: React.CSSProperties = {
  background: "#F5F2EB",
  color: "#FF3C00",
  border: "1px solid #F5F2EB",
};
