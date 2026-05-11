import LiquidGradient from "./LiquidGradient";

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
  return (
    <>
      <section className="srv-section" id="servicios">
        <LiquidGradient />
        <div style={{
          position: "absolute",
          width: "100%",
          height: "70%",
          top: "0%",
          left: "0",
          background: "radial-gradient(ellipse at 35% 30%, rgba(255,60,0,0.75) 0%, rgba(255,60,0,0.35) 40%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orb-red 10s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <div className="srv-inner">

          <div className="srv-label">Catálogo de Servicios</div>

          {services.map((s) => (
            <div key={s.num} className={`srv-card ${s.cls}`}>
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
                <button className="srv-trigger">
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
                    <button className="srv-contact-btn srv-contact-js">
                      Iniciar proyecto <span className="srv-contact-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          function init(){
            var section = document.getElementById('servicios');
            if (!section) return;
            section.addEventListener('click', function(e){
              var trigger = e.target.closest('.srv-trigger');
              var contactBtn = e.target.closest('.srv-contact-js');
              if (contactBtn) {
                var el = document.getElementById('contacto');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                return;
              }
              if (!trigger) return;
              var card = trigger.closest('.srv-card');
              if (!card) return;
              var wasOpen = card.classList.contains('is-open');
              section.querySelectorAll('.srv-card.is-open').forEach(function(c){ c.classList.remove('is-open'); });
              if (!wasOpen) card.classList.add('is-open');
            });
          }
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
          else init();
        })();
      `}} />
    </>
  );
}
