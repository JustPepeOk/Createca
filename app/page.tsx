import Hero from "@/components/Hero";
import Historia from "@/components/Historia";
import HistoriaMobile from "@/components/HistoriaMobile";
import ServiciosResumen from "@/components/ServiciosResumen";
import Clientes from "@/components/Clientes";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Mobile: VH for hero zoom + historia content height (set dynamically by JS) */}
      {/* height is corrected synchronously by the end-of-body script; 320vh is a reasonable fallback */}
      <div id="mobile-scroll-spacer" className="md:hidden" style={{ height: "320vh", pointerEvents: "none" }} aria-hidden="true" />
      <div className="hidden md:block">
        <Historia />
      </div>
      <HistoriaMobile />
      <div style={{ position: "relative", zIndex: 50 }}>
        <ServiciosResumen />
        <Clientes />
        <Footer />
      </div>
    </>
  );
}
