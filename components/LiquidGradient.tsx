"use client";

export default function LiquidGradient() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>

      {/* Orbe azul — sangra hacia abajo igual que el rojo sangra hacia arriba */}
      <div style={{
        position: "absolute",
        width: "140%",
        height: "100%",
        bottom: "-30%",
        right: "-30%",
        background: "radial-gradient(ellipse at 60% 40%, #093F93 0%, rgba(9,63,147,0.7) 40%, transparent 65%)",
        filter: "blur(80px)",
        animation: "orb-blue 13s ease-in-out infinite",
      }} />


    </div>
  );
}
