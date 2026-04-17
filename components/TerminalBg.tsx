"use client";

import { useEffect, useRef } from "react";

const LINES = [
  "SYSTEM ACTIVE · CREATECA OS v2.6.0",
  "LOADING MODULE: brand.architecture ........... OK",
  "LOADING MODULE: strategic.positioning ........ OK",
  "LOADING MODULE: identity.system .............. OK",
  "INIT 0x00A1 — conexión establecida",
  "COORD 19.4326° N  99.1332° W — CDMX BASE",
  "PROCESO: análisis de mercado en curso",
  "REGISTRO: cliente_0x04 — expediente abierto",
  "STATUS: campaña activa · fase 2 de 4",
  "UPTIME: 3652d 14h 22m",
  "> ejecutando sistema_identidad.sh",
  "OUTPUT: marca coherente · escala 1:1",
  "ALERT: competidor detectado · analizando",
  "RESPONSE: diferenciación estratégica activada",
  "SIG: arquitectura de marca · integridad 100%",
  "MÓDULO: proyectos_disruptivos.init()",
  "LOG: brief recibido · procesando",
  "HASH: a3f9d1c · concepto validado",
  "BUILD: identidad_visual.compile → éxito",
  "DEPLOY: campaña_0x09 → producción",
  "> createca --run sistema --modo alto_impacto",
  "CONECTANDO: red_creativa ··· establecido",
  "MEM: 64TB estrategia cargada",
  "CPU: 99.9% · pensamiento sistémico activo",
  "ARCHIVO: expediente_0x17 actualizado",
  "EXEC: posicionamiento.calculate()",
  "RESULT: diferenciador_único = true",
  "NULL: ruido descartado · señal conservada",
  "> marca que perdura · arquitectura activa",
];

export default function TerminalBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Build a long repeating column of lines
    const repeat = 4;
    const content = Array.from({ length: repeat }, () => LINES)
      .flat()
      .map(l => `<div>${l}</div>`)
      .join("");
    el.innerHTML = content + content; // duplicate for seamless loop

    const totalH = el.scrollHeight / 2;

    let y = 0;
    let animId: number;
    const speed = 0.4; // px per frame

    const tick = () => {
      y += speed;
      if (y >= totalH) y = 0;
      el.style.transform = `translateY(${-y}px)`;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        ref={ref}
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: "10px",
          lineHeight: "2.2",
          color: "rgba(245,242,235,0.06)",
          whiteSpace: "nowrap",
          userSelect: "none",
          willChange: "transform",
          paddingTop: "20px",
        }}
      />
    </div>
  );
}
