import Image from "next/image";
import { STACK_ITEMS } from "@/lib/constants";

export function WorkScope() {
  return (
    <section className="section work-scope-section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="eyebrow">Portafolio aplicado</p>
            <h2 className="section-title">
              Puedo construir desde una página de negocio hasta un sistema operativo completo.
            </h2>
            <p className="section-copy mt-5">
              El enfoque es simple: que el sitio se vea profesional, funcione perfecto en celular y
              tenga caminos claros para que el visitante contacte, cotice o compre.
            </p>
          </div>

          <div className="case-showcase-duo">
            <div className="case-browser case-desktop-duo">
              <div className="case-topbar">
                <div className="panel-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <p>dashboard / reportes</p>
              </div>
              <div className="case-screen-duo">
                <Image
                  src="/servimos-reportes.png"
                  alt="Dashboard de reportes en escritorio"
                  fill
                  sizes="(min-width: 1024px) 520px, 62vw"
                  className="case-image-desktop"
                />
              </div>
            </div>

            <div className="case-phone-duo">
              <div className="case-phone-label">menú / pedido</div>
              <div className="case-phone-screen-duo">
                <Image
                  src="/pedimos-menu-mobile.png"
                  alt="Menú móvil para que el cliente haga su pedido"
                  fill
                  sizes="(min-width: 1024px) 220px, 34vw"
                  className="case-image-phone"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {STACK_ITEMS.map((item) => (
            <article key={item.title} className="stack-card">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
