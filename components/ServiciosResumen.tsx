"use client";

import { useState } from "react";
import LiquidGradient from "./LiquidGradient";

const CSS = `
@keyframes orb-red {
  0%,100% { transform: translate(0%, 0%) scale(1); }
  25%      { transform: translate(20%, 15%) scale(1.2); }
  55%      { transform: translate(-10%, 25%) scale(0.9); }
  80%      { transform: translate(15%, -10%) scale(1.15); }
}
.srv-section {
  background: #090909;
  color: #F5F2EB;
  font-family: var(--font-jetbrains-mono), monospace;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 36;
  margin-top: -2px;
}
.srv-inner {
  padding: 5rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}
@media(max-width:768px){
  .srv-inner { padding: 3rem 1.5rem; }
}

.srv-label {
  font-size: 0.875rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245,242,235,0.5);
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: inherit;
}
.srv-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(245,242,235,0.3), transparent);
}

/* === SERVICE CARD === */
.srv-card {
  position: relative;
  border-top: 1px solid rgba(245,242,235,0.15);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.4s;
}
.srv-card:last-child {
  border-bottom: 1px solid rgba(245,242,235,0.15);
}
.srv-card.is-open {
  border-color: rgba(245,242,235,0.2);
}

/* background effect */
.srv-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1);
  z-index: 0;
  pointer-events: none;
}
.srv-card.is-open .srv-bg,
.srv-card:hover .srv-bg { opacity: 1; }

/* ghost number */
.srv-ghost {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  font-size: clamp(8rem,14vw,13rem);
  font-weight: 800;
  line-height: 1;
  z-index: 0;
  transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
  pointer-events: none;
  user-select: none;
}
.srv-ghost text {
  stroke: rgba(245,242,235,0.22);
  transition: stroke 0.8s cubic-bezier(0.16,1,0.3,1);
}
.srv-card.is-open .srv-ghost,
.srv-card:hover .srv-ghost {
  transform: translateY(-50%) translateX(0);
}
.srv-card.is-open .srv-ghost text,
.srv-card:hover .srv-ghost text {
  stroke: rgba(245,242,235,0.38);
}
@media(max-width:768px){ .srv-ghost { font-size: 6rem; right: 0; } }

/* content */
.srv-content { position: relative; }

/* trigger row */
.srv-trigger {
  display: flex;
  align-items: center;
  padding: 2.5rem 0;
  gap: 1.5rem;
  width: 100%;
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
}
@media(max-width:768px){ .srv-trigger { padding: 2rem 0; flex-wrap: wrap; gap: 1rem; } }

.srv-num {
  color: #FF3C00;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  flex-shrink: 0;
  transition: color 0.3s, text-shadow 0.3s;
}
.srv-card.is-open .srv-num,
.srv-card:hover .srv-num {
  color: #ff6633;
  text-shadow: 0 0 20px rgba(255,60,0,0.4);
}

.srv-meta-line {
  width: 2rem; height: 1px; flex-shrink: 0;
  background: rgba(245,242,235,0.2);
  transition: width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s;
}
.srv-card.is-open .srv-meta-line,
.srv-card:hover .srv-meta-line {
  width: 3rem;
  background: rgba(245,242,235,0.25);
}

.srv-title {
  font-size: clamp(2rem, 3.5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.1;
  flex: 1;
  transition: letter-spacing 0.4s;
  color: #F5F2EB;
}
.srv-card.is-open .srv-title,
.srv-card:hover .srv-title { letter-spacing: 0.06em; }

.srv-tags {
  display: flex; gap: 0.5rem; flex-shrink: 0;
  font-size: 10px; letter-spacing: 0.15em;
  color: rgba(245,242,235,0.35);
  text-transform: uppercase;
}
@media(max-width:768px){ .srv-tags { display: none; } }

.srv-chevron {
  font-size: 1rem;
  color: rgba(245,242,235,0.3);
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s;
}
.srv-card.is-open .srv-chevron {
  transform: rotate(180deg);
  color: rgba(245,242,235,0.7);
}

/* === EXPANDED PANEL === */
.srv-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.16,1,0.3,1);
}
.srv-card.is-open .srv-panel {
  max-height: 600px;
}

.srv-panel-inner {
  padding: 0 0 3rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 4rem;
}
@media(max-width:768px){
  .srv-panel-inner { grid-template-columns: 1fr; gap: 1.5rem; }
}

.srv-desc {
  font-family: var(--font-bahnschrift), Bahnschrift, sans-serif;
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(245,242,235,0.7);
  margin: 0;
}

.srv-deliverables {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.srv-deliverables li {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: rgba(245,242,235,0.5);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.srv-deliverables li::before {
  content: '';
  width: 16px; height: 1px; flex-shrink: 0;
  background: #090909;
}

.srv-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 2rem;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #F5F2EB;
  background: none;
  border: 1px solid rgba(245,242,235,0.35);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;
  grid-column: 1 / -1;
  width: fit-content;
}
.srv-contact-btn:hover {
  background: rgba(245,242,235,0.06);
  border-color: rgba(245,242,235,0.7);
  color: #ffffff;
}
.srv-contact-btn-arrow {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.srv-contact-btn:hover .srv-contact-btn-arrow { transform: translateX(5px); }

`;

const services = [
  {
    num: "01",
    cls: "",
    title: "Marketing Estratégico",
    tags: ["Estrategia", "·", "Posicionamiento"],
    desc: "Desarrollo de estrategias de comunicación y posicionamiento alineadas a los objetivos de negocio. Sin tácticas genéricas — solo arquitectura de marca con propósito.",
    deliverables: [
      "Diagnóstico de marca y auditoría competitiva",
      "Arquitectura de posicionamiento",
      "Plan de comunicación 360°",
      "Métricas y KPIs de éxito",
    ],
  },
  {
    num: "02",
    cls: "",
    title: "Identidad Visual",
    tags: ["Branding", "·", "Logo", "·", "Sistema"],
    desc: "Construcción de sistemas de identidad visual coherentes y escalables. Del concepto al manual. Del logo al ecosistema completo de marca.",
    deliverables: [
      "Naming y concepto de marca",
      "Sistema de identidad: logo, tipografía, paleta",
      "Manual de identidad corporativa",
      "Aplicaciones y adaptaciones clave",
    ],
  },
  {
    num: "03",
    cls: "",
    title: "Proyectos Disruptivos",
    tags: ["Campañas", "·", "Activaciones"],
    desc: "Campañas y activaciones que rompen el patrón de la categoría. Ejecuciones que generan conversación, no solo impresiones.",
    deliverables: [
      "Brief creativo y concepto central",
      "Producción y dirección de campaña",
      "Activaciones físicas y digitales",
      "Análisis de impacto post-campaña",
    ],
  },
];

export default function ServiciosResumen() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="srv-section" id="servicios">
        <LiquidGradient />
        {/* Orbe rojo fuera del overflow:hidden — se cuela en 2026 */}
        <div style={{
          position: "absolute",
          width: "120%",
          height: "100%",
          top: "-30%",
          left: "-20%",
          background: "radial-gradient(ellipse at 40% 40%, #FF3C00 0%, rgba(255,60,0,0.6) 35%, transparent 65%)",
          filter: "blur(70px)",
          animation: "orb-red 10s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <div className="srv-inner">

          <div className="srv-label">Catálogo de Servicios</div>

          {services.map((s, i) => (
            <div
              key={s.num}
              className={`srv-card ${s.cls}${open === i ? " is-open" : ""}`}
            >
              <svg className="srv-ghost" overflow="visible" width="1.6em" height="1em" aria-hidden="true">
                <text
                  x="1.5em" y="0.85em"
                  textAnchor="end"
                  fontSize="1em"
                  fontWeight="800"
                  fontFamily="var(--font-jetbrains-mono), JetBrains Mono, monospace"
                  fill="rgba(245,242,235,0.08)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                >
                  {s.num}
                </text>
              </svg>
              <div className="srv-content">

                <button className="srv-trigger" onClick={() => toggle(i)}>
                  <span className="srv-num">[{s.num}]</span>
                  <span className="srv-meta-line" />
                  <span className="srv-title">{s.title}</span>
                  <div className="srv-tags">
                    {s.tags.map((t, j) => <span key={j}>{t}</span>)}
                  </div>
                  <span className="srv-chevron">▾</span>
                </button>

                <div className="srv-panel">
                  <div className="srv-panel-inner">
                    <p className="srv-desc">{s.desc}</p>
                    <ul className="srv-deliverables">
                      {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                    <button className="srv-contact-btn" onClick={scrollToContact}>
                      Iniciar proyecto <span className="srv-contact-btn-arrow">→</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
}
