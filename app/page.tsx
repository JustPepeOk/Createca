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
