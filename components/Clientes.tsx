"use client";

const logos = [
  { src: "/logos/sapal.svg",                        alt: "Sapal" },
  { src: "/logos/Logo-EGPV1.png",                   alt: "EGP" },
  { src: "/logos/club-leon-logo-0.png",              alt: "Club León" },
  { src: "/logos/FRASCATI-LOGO-BLANCO-scaled.png",  alt: "Frascati" },
  { src: "/logos/argentilia.png",                   alt: "Argentilia" },
  { src: "/logos/caja-popular-mexicana-seeklogo.png",alt: "Caja Popular Mexicana" },
  { src: "/logos/logoGaceta.png",                   alt: "Gaceta" },
];

const CSS = `
.cli-section {
  background: #090909;
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 35;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
}
.cli-label {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 1.1rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(245,242,235,0.3);
  text-align: center;
}
.cli-track-wrap {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
@keyframes cli-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.cli-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: cli-scroll 40s linear infinite;
  gap: 8rem;
  padding: 0 4rem;
}
.cli-logo-wrap {
  width: 280px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cli-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.65;
  transition: opacity 0.3s;
  user-select: none;
  pointer-events: none;
}
.cli-sep {
  color: rgba(255,60,0,0.35);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 2rem;
  flex-shrink: 0;
  user-select: none;
}
`;

export default function Clientes() {
  const items = [...logos, ...logos];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="cli-section" id="clientes">
        <p className="cli-label">Nuestros Clientes</p>
        <div className="cli-track-wrap">
          <div className="cli-track">
            {items.map((logo, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "5rem" }}>
                <span className="cli-logo-wrap" style={logo.alt === "Club León" ? { width: 160, height: 160 } : undefined}>
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
