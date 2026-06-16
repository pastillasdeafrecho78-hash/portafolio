import Image from "next/image";
import { CAPABILITIES, STACK_ITEMS } from "@/lib/constants";

export function WorkScope() {
  return (
    <section className="section work-scope-section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="eyebrow">Portafolio aplicado</p>
            <h2 className="section-title">
              Puedo construir desde una página de negocio hasta un sistema operativo completo.
            </h2>
            <p className="section-copy mt-6">
              El enfoque es simple: que el sitio se vea profesional, funcione perfecto en celular y
              tenga caminos claros para que el visitante contacte, cotice o compre.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((capability) => (
                <div key={capability} className="capability-pill">
                  {capability}
                </div>
              ))}
            </div>
          </div>

          <div className="case-showcase-duo">
            <div className="case-browser case-duo-panel">
              <div className="case-topbar">
                <div className="panel-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <p>dashboard / reportes</p>
              </div>
              <div className="case-image-wrap-duo">
                <Image
                  src="/servimos-reportes.png"
                  alt="Dashboard de reportes para operación de restaurante"
                  fill
                  sizes="(min-width: 1024px) 360px, 46vw"
                  className="case-image-fit"
                />
              </div>
            </div>

            <div className="case-browser case-duo-panel">
              <div className="case-topbar compact">
                <div className="panel-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <p>comandas</p>
              </div>
              <div className="case-image-wrap-duo">
                <Image
                  src="/servimos-comandas.png"
                  alt="Interfaz de comandas y pedidos"
                  fill
                  sizes="(min-width: 1024px) 360px, 46vw"
                  className="case-image-fit"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {STACK_ITEMS.map((item) => (
            <article key={item.title} className="stack-card">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
