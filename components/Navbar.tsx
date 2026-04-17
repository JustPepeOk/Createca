"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ghost/10 bg-carbon/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/purologoblanco.svg" alt="CREATECA" style={{ height: "36px", width: "auto", display: "block" }} />
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo("servicios")}
            className="font-mono text-xs tracking-widest uppercase text-ghost/60 hover:text-ghost transition-colors duration-200"
          >
            Servicios
          </button>
          <button
            onClick={() => scrollTo("contacto")}
            className="font-mono text-xs tracking-widest uppercase text-ghost/60 hover:text-ghost transition-colors duration-200"
          >
            Contacto
          </button>
        </div>
      </div>
    </nav>
  );
}
