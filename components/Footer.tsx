import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ghost/10 bg-carbon">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="font-mono text-sm tracking-widest text-ghost">
            20&nbsp;&nbsp;[CREATECA]&nbsp;&nbsp;26
          </span>
          <span className="font-mono text-xs text-ghost/40 tracking-wider">
            México
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/servicios"
              className="font-mono text-xs text-ghost/50 hover:text-ghost transition-colors duration-200 tracking-wider uppercase"
            >
              Servicios
            </Link>
            <Link
              href="/contacto"
              className="font-mono text-xs text-ghost/50 hover:text-ghost transition-colors duration-200 tracking-wider uppercase"
            >
              Contacto
            </Link>
            <Link
              href="/aviso-de-privacidad"
              className="font-mono text-xs text-ghost/30 hover:text-ghost/60 transition-colors duration-200 tracking-wider"
            >
              Aviso de privacidad
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-ghost/5">
          <p className="font-mono text-xs text-ghost/20 tracking-widest">
            DEVELOPING BRAND THROUGH A NEW WORLD VISION
          </p>
        </div>
      </div>
    </footer>
  );
}
