import Hero from "@/components/Hero";
import Historia from "@/components/Historia";
import HistoriaMobile from "@/components/HistoriaMobile";
import ServiciosResumen from "@/components/ServiciosResumen";
import Clientes from "@/components/Clientes";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          #hero { position: fixed !important; inset: 0; height: 100vh !important; z-index: 10; }
          #historia-mobile { opacity: 0; }
        }
      `}</style>
      <Hero />
      {/* 100vh spacer: at scrollY=VH historia fills the viewport, matching the snap target */}
      <div id="hero-mobile-spacer" className="block md:hidden" style={{ height: "100vh" }} />
      <div className="hidden md:block">
        <Historia />
      </div>
      <HistoriaMobile />
      <ServiciosResumen />
      <Clientes />
      <Footer />
    </>
  );
}
