export default function AvisoDePrivacidad() {
  return (
    <div className="min-h-screen bg-carbon pt-14">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-[10px] text-orange tracking-[0.4em] uppercase">
            Legal
          </span>
          <div className="h-px w-16 bg-ghost/10" />
        </div>

        <h1 className="font-mono text-2xl text-ghost tracking-wider mb-10">
          AVISO DE PRIVACIDAD
        </h1>

        <div className="space-y-8 font-sans text-sm text-ghost/60 leading-relaxed">
          <section>
            <h2 className="font-mono text-xs text-ghost/40 tracking-widest uppercase mb-3">
              Responsable
            </h2>
            <p>
              CREATECA es responsable del tratamiento de los datos personales que
              usted nos proporcione. Con domicilio en México.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs text-ghost/40 tracking-widest uppercase mb-3">
              Datos que recabamos
            </h2>
            <p>
              Recabamos nombre, nombre de empresa y descripción del proyecto o
              necesidad, únicamente con la finalidad de contactar y dar seguimiento
              a solicitudes de servicio.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs text-ghost/40 tracking-widest uppercase mb-3">
              Finalidades
            </h2>
            <p>
              Los datos son utilizados exclusivamente para responder a consultas
              y gestionar relaciones comerciales. No se comparten con terceros
              sin consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs text-ghost/40 tracking-widest uppercase mb-3">
              Derechos ARCO
            </h2>
            <p>
              Usted puede ejercer sus derechos de Acceso, Rectificación,
              Cancelación u Oposición enviando una solicitud a{" "}
              <a
                href="mailto:hola@createca.mx"
                className="text-ghost/80 hover:text-ghost transition-colors"
              >
                hola@createca.mx
              </a>
              .
            </p>
          </section>

          <p className="font-mono text-xs text-ghost/20 tracking-widest pt-4">
            Última actualización: 2026
          </p>
        </div>
      </div>
    </div>
  );
}
