"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

type FormState = "idle" | "sending" | "sent" | "error";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", marca: "", necesitas: "" });
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const headerRef = useRef(null);
  const formRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const formInView = useInView(formRef, { once: true });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.marca || !form.necesitas) {
      setError("Todos los campos son requeridos.");
      return;
    }
    setError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ nombre: "", marca: "", necesitas: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-carbon pt-14">
      {/* Header */}
      <div ref={headerRef} className="border-b border-ghost/10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
              Expediente
            </span>
            <div className="h-px w-16 bg-ghost/10" />
          </motion.div>

          <motion.h1
            className="font-mono text-3xl sm:text-4xl text-ghost tracking-wider mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            CONTACTO
          </motion.h1>

          <motion.p
            className="font-sans text-sm text-ghost/40 max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            &ldquo;La creatividad sin estructura es solo ruido.&rdquo; — Si tienes un proyecto,
            cuéntanos. Si no sabes por dónde empezar, cuéntanos también.
          </motion.p>
        </div>
      </div>

      {/* Form + Contact info */}
      <div ref={formRef} className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {status === "sent" ? (
              <div className="border border-ghost/10 p-10">
                <span className="font-mono text-[10px] text-orange tracking-widest block mb-4 uppercase">
                  Expediente recibido
                </span>
                <p className="font-sans text-sm text-ghost/60">
                  Tu información fue registrada. Nos pondremos en contacto a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-8">
                  {/* Nombre */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="nombre"
                      className="font-mono text-[10px] text-ghost/30 tracking-[0.3em] uppercase"
                    >
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      autoComplete="name"
                      className="bg-transparent border-b border-ghost/20 py-3 font-sans text-sm text-ghost placeholder-ghost/20 focus:outline-none focus:border-ghost/60 transition-colors duration-200"
                      placeholder="Tu nombre completo"
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Marca / Empresa */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="marca"
                      className="font-mono text-[10px] text-ghost/30 tracking-[0.3em] uppercase"
                    >
                      Marca / Empresa
                    </label>
                    <input
                      id="marca"
                      name="marca"
                      type="text"
                      value={form.marca}
                      onChange={handleChange}
                      autoComplete="organization"
                      className="bg-transparent border-b border-ghost/20 py-3 font-sans text-sm text-ghost placeholder-ghost/20 focus:outline-none focus:border-ghost/60 transition-colors duration-200"
                      placeholder="Nombre de tu marca o empresa"
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Qué necesitas */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="necesitas"
                      className="font-mono text-[10px] text-ghost/30 tracking-[0.3em] uppercase"
                    >
                      ¿Qué necesitas?
                    </label>
                    <textarea
                      id="necesitas"
                      name="necesitas"
                      value={form.necesitas}
                      onChange={handleChange}
                      rows={5}
                      className="bg-transparent border-b border-ghost/20 py-3 font-sans text-sm text-ghost placeholder-ghost/20 focus:outline-none focus:border-ghost/60 transition-colors duration-200 resize-none"
                      placeholder="Describe brevemente tu proyecto o necesidad"
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="font-mono text-xs text-orange tracking-wide">
                      {error}
                    </p>
                  )}
                  {status === "error" && (
                    <p className="font-mono text-xs text-orange tracking-wide">
                      Ocurrió un error. Intenta nuevamente o escríbenos directamente.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="font-mono text-xs tracking-[0.25em] uppercase px-8 py-3 bg-orange text-ghost hover:bg-sand hover:text-carbon transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Enviando..." : "Enviar al archivo"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="border-l border-ghost/10 pl-8 space-y-10">
              <div>
                <span className="font-mono text-[10px] text-ghost/30 tracking-[0.3em] uppercase block mb-4">
                  Contacto directo
                </span>
                <ul className="space-y-4">
                  <li>
                    <span className="font-mono text-[10px] text-orange tracking-widest block mb-1 uppercase">
                      Email
                    </span>
                    <a
                      href="mailto:hola@createca.mx"
                      className="font-sans text-sm text-ghost/60 hover:text-ghost transition-colors duration-200"
                    >
                      hola@createca.mx
                    </a>
                  </li>
                  <li>
                    <span className="font-mono text-[10px] text-orange tracking-widest block mb-1 uppercase">
                      Instagram
                    </span>
                    <a
                      href="https://instagram.com/createca.mx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-ghost/60 hover:text-ghost transition-colors duration-200"
                    >
                      @createca.mx
                    </a>
                  </li>
                  <li>
                    <span className="font-mono text-[10px] text-orange tracking-widest block mb-1 uppercase">
                      LinkedIn
                    </span>
                    <a
                      href="https://linkedin.com/company/createca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-ghost/60 hover:text-ghost transition-colors duration-200"
                    >
                      linkedin.com/company/createca
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <span className="font-mono text-[10px] text-ghost/30 tracking-[0.3em] uppercase block mb-3">
                  Sede
                </span>
                <p className="font-sans text-xs text-ghost/40">México</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
