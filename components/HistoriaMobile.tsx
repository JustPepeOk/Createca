const epochs = [
  {
    year: "2012",
    img: "/72ppi/2012@72x.png",
    label: "FUNDACIÓN",
    idx: "01",
    desc: "Constitución formal de la agencia. Primeros clientes en branding e identidad visual para marcas de consumo en México.",
    yearClass: "year-archive",
    active: false,
  },
  {
    year: "2020",
    img: "/72ppi/2020@72x.png",
    label: "PAUSA",
    idx: "02",
    desc: "Reconfiguración estratégica. Periodo de análisis, documentación interna y redefinición del modelo operativo.",
    yearClass: "year-broken",
    active: false,
  },
  {
    year: "2026",
    img: "/72ppi/2026@72x.png",
    label: "RENACIMIENTO",
    idx: "03",
    desc: "Reactivación con nuevo posicionamiento. Enfoque en proyectos de alto impacto y desarrollo de marca sistémico.",
    yearClass: "year-chroma",
    active: true,
  },
];

export default function HistoriaMobile() {
  return (
    <section id="historia-mobile" className="md:hidden" style={{
      background: "#090909", color: "#F5F2EB",
      position: "relative", zIndex: 20,
    }}>
      <div id="historia-inner">

      {/* ── Manifesto ── */}
      <div style={{ padding: "4.5rem 1.5rem 3.5rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <span style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(245,242,235,0.45)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}>
            EL MANIFIESTO
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(245,242,235,0.12)" }} />
        </div>

        <div style={{ position: "relative", margin: "0 -1.5rem", marginBottom: "2rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/72ppi/[.png" alt="" style={{
            position: "absolute", left: 0, top: 0,
            width: 90, height: "100%",
            objectFit: "fill",
            userSelect: "none", pointerEvents: "none",
            zIndex: 0,
          }} />
          <h2 style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "1.25rem",
            fontWeight: 700,
            lineHeight: 1.4,
            position: "relative",
            zIndex: 1,
            padding: "0.5rem 100px",
          }}>
            La creatividad no es un impulso.
            <br />
            <span style={{ color: "rgba(245,242,235,0.45)" }}>
              Es un sistema de preservación estratégica.
            </span>
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/72ppi/].png" alt="" style={{
            position: "absolute", right: 0, top: 0,
            width: 90, height: "100%",
            objectFit: "fill",
            userSelect: "none", pointerEvents: "none",
            zIndex: 0,
          }} />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          fontFamily: "var(--font-bahnschrift), Bahnschrift, sans-serif",
          fontSize: "0.875rem",
          color: "rgba(245,242,235,0.65)",
          lineHeight: 1.75,
        }}>
          <p>
            Vivimos en un momento donde todo comunica y nada permanece. Las marcas se construyen
            en segundos y colapsan en menos tiempo. La velocidad se confundió con relevancia.
            El ruido, con presencia.
          </p>
          <p>
            CREATECA nace de la convicción de que el verdadero diferencial no está en el impulso
            creativo —está en la arquitectura que lo sostiene. Una marca que dura no es la que
            grita más fuerte. Es la que tiene estructura, coherencia y visión de largo plazo.
          </p>
          <p>
            Operamos en la intersección de la estrategia y la creación. No hacemos diseño por
            estética ni marketing por volumen. Construimos sistemas que le dan forma a las ideas
            y dirección a las marcas que quieren perdurar.
          </p>
          <p style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(245,242,235,0.3)",
            letterSpacing: "0.3em",
            marginTop: "0.5rem",
          }}>
            — CREATECA, 2026
          </p>
        </div>
      </div>

      {/* ── Epoch cards ── */}
      {epochs.map((epoch) => (
        <div
          key={epoch.year}
          style={{ position: "relative", height: "70vh", overflow: "hidden" }}
        >
          {/* Background image — contain so the full number is visible */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={epoch.img}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center center",
              opacity: epoch.active ? 0.7 : 0.45,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.45) 55%, rgba(9,9,9,0.1) 100%)",
          }} />

          {/* Text */}
          <div style={{ position: "absolute", bottom: "2.5rem", left: "1.5rem", right: "1.5rem" }}>

            <span style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: epoch.active ? "#931818" : "rgba(245,242,235,0.55)",
              display: "block",
              marginBottom: "0.75rem",
            }}>
              — {epoch.label}
            </span>

            <p style={{
              fontFamily: "var(--font-bahnschrift), Bahnschrift, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(245,242,235,0.65)",
              lineHeight: 1.65,
              maxWidth: "28ch",
            }}>
              {epoch.desc}
            </p>

          </div>
        </div>
      ))}

      </div>{/* end historia-inner */}
    </section>
  );
}
