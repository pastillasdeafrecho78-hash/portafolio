import { SERVICES } from "@/lib/constants";

export function Services() {
  return (
    <section id="servicios" className="section section-muted">
      <div className="container-page">
        <div className="section-heading">
          <p className="eyebrow">Servicios</p>
          <h2 className="section-title">
            Soluciones digitales claras, funcionales y listas para negocio.
          </h2>
          <p className="section-copy">
            Trabajo con empresas y profesionales que necesitan una presencia digital seria, fácil de
            entender y preparada para recibir prospectos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="premium-card">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
