const logos = [
  { src: "/logos/sapal.svg",                        alt: "Sapal" },
  { src: "/logos/Logo-EGPV1.png",                   alt: "EGP" },
  { src: "/logos/club-leon-logo-0.png",              alt: "Club León" },
  { src: "/logos/FRASCATI-LOGO-BLANCO-scaled.png",  alt: "Frascati" },
  { src: "/logos/argentilia.png",                   alt: "Argentilia" },
  { src: "/logos/caja-popular-mexicana-seeklogo.png",alt: "Caja Popular Mexicana" },
  { src: "/logos/logoGaceta.png",                   alt: "Gaceta" },
];

export default function Clientes() {
  const items = [...logos, ...logos];

  return (
    <>
      <section className="cli-section" id="clientes">
        <p className="cli-label">Nuestros Clientes</p>
        <div className="cli-track-wrap">
          <div className="cli-track">
            {items.map((logo, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "5rem" }}>
                <span className={`cli-logo-wrap${logo.alt === "Club León" ? " cli-logo-wrap--leon" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={logo.alt} className="cli-logo" />
                </span>
                <span className="cli-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
