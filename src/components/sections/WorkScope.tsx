import { STACK_ITEMS } from "@/lib/constants";

function ScopeVisual() {
  return (
    <div className="scope-visual" aria-hidden="true">
      <div className="scope-desktop">
        <div className="scope-desktop-topbar">
          <span />
          <span />
          <span />
          <p>escritorio / operación</p>
        </div>
        <div className="scope-desktop-body">
          <div className="scope-metrics">
            <div className="scope-metric" />
            <div className="scope-metric accent" />
            <div className="scope-metric" />
          </div>
          <div className="scope-chart">
            <span style={{ height: "45%" }} />
            <span style={{ height: "72%" }} />
            <span style={{ height: "58%" }} />
            <span style={{ height: "88%" }} />
            <span style={{ height: "64%" }} />
            <span style={{ height: "78%" }} />
          </div>
          <div className="scope-table">
            <div className="scope-row header">
              <span />
              <span />
              <span />
            </div>
            <div className="scope-row">
              <span />
              <span />
              <span className="pill" />
            </div>
            <div className="scope-row">
              <span />
              <span />
              <span className="pill muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="scope-phone">
        <div className="scope-phone-notch" />
        <div className="scope-phone-screen">
          <div className="scope-menu-header" />
          <div className="scope-menu-item active" />
          <div className="scope-menu-item" />
          <div className="scope-menu-item" />
          <div className="scope-menu-item short" />
          <div className="scope-menu-cta" />
        </div>
        <p className="scope-phone-caption">móvil / pedido</p>
      </div>
    </div>
  );
}

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

          <ScopeVisual />
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
