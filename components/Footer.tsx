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

  const sectionRef        = useRef<HTMLDivElement>(null);
  const leftRef           = useRef<HTMLDivElement>(null);
  const rightRef          = useRef<HTMLDivElement>(null);
  const contentRef        = useRef<HTMLDivElement>(null);
  const lanyardWrapRef    = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    const left    = leftRef.current;
    const right   = rightRef.current;
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!left || !right || !content || !section) return;

    gsap.set(left,    { scaleX: 0, transformOrigin: "left center" });
    gsap.set(right,   { scaleX: 0, transformOrigin: "right center" });
    gsap.set(content, { autoAlpha: 0, y: 24 });

    // Franjas + formulario — scrub controlado por scroll
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

    // Lanyard — monta cuando el footer entra, fade out al regresar
    const lanyardSt = ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      onEnter: () => {
        gsap.set(lanyardWrapRef.current, { autoAlpha: 1 });
        setShowLanyard(true);
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
    <footer id="contacto">

      {/* ── MAIN SECTION ── */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          minHeight: "760px",
          background: "#090909",
          overflow: "hidden",
        }}
      >
        {/* Franja roja — izquierda */}
        <div ref={leftRef} style={{
          position: "absolute", inset: 0,
          width: "50%", left: 0,
          background: "#FF3C00",
        }} />

        {/* Franja roja — derecha */}
        <div ref={rightRef} style={{
          position: "absolute", inset: 0,
          width: "50%", right: 0, left: "auto",
          background: "#FF3C00",
        }} />

        {/* Contenido — aparece después de que se forma la franja */}
        <div ref={contentRef} className="footer-content" style={{ position: "relative", zIndex: 10, display: "flex", minHeight: "760px" }}>

          {/* Lanyard — mitad derecha, monta al entrar y fade out al salir */}
          <div ref={lanyardWrapRef} className="hidden md:block absolute top-0 right-0 bottom-0" style={{ width: "50%", zIndex: 50, visibility: "hidden", opacity: 0 }}>
            {showLanyard && <Lanyard position={[0, 0, 9]} gravity={[0, -40, 0]} fov={24} transparent />}
          </div>

          {/* Form — mitad izquierda */}
          <style dangerouslySetInnerHTML={{ __html: `
            .footer-input::placeholder { color: rgba(245,242,235,0.5); }
            .footer-input:focus { border-color: rgba(245,242,235,0.9) !important; outline: none; }
            @media (max-width: 768px) {
              .footer-content { flex-direction: column !important; min-height: unset !important; }
              .footer-form-col { max-width: 100% !important; padding: 3rem 1.5rem 2.5rem !important; width: 100% !important; }
              .footer-input-grid { grid-template-columns: 1fr !important; }
            }
          `}} />
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
          <span style={{ fontSize: "0.875rem", letterSpacing: "0.15em", color: "#F5F2EB" }}>
            20&nbsp;&nbsp;[CREATECA]&nbsp;&nbsp;26
          </span>
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
