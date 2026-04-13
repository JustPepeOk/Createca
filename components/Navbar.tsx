"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ghost/10 bg-carbon/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm tracking-widest text-ghost hover:text-sand transition-colors duration-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_blanco.svg" alt="CREATECA" style={{ height: "20px", width: "auto", display: "block" }} />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/servicios"
            className={`font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
              pathname === "/servicios"
                ? "text-orange"
                : "text-ghost/60 hover:text-ghost"
            }`}
          >
            Servicios
          </Link>
          <Link
            href="/contacto"
            className={`font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
              pathname === "/contacto"
                ? "text-orange"
                : "text-ghost/60 hover:text-ghost"
            }`}
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
