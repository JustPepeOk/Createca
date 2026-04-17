"use client";

const CSS = `
  @keyframes orb-blue {
    0%,100% { transform: translate(0%, 0%) scale(1); }
    30%      { transform: translate(-20%, -15%) scale(1.18); }
    60%      { transform: translate(12%, -25%) scale(0.88); }
    85%      { transform: translate(-15%, 12%) scale(1.12); }
  }
`;

export default function LiquidGradient() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

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
