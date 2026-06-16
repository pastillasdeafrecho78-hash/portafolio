import { PROJECTS } from "@/lib/constants";

function InsightsVisual() {
  return (
    <div className="project-insights-visual" aria-hidden="true">
      <div className="insights-topbar">
        <span />
        <span />
        <span />
        <p>panel / insights</p>
      </div>
      <div className="insights-body">
        <div className="insights-metrics">
          <div className="insights-metric">
            <span className="insights-metric-label" />
            <span className="insights-metric-value" />
          </div>
          <div className="insights-metric">
            <span className="insights-metric-label" />
            <span className="insights-metric-value accent" />
          </div>
          <div className="insights-metric">
            <span className="insights-metric-label" />
            <span className="insights-metric-value" />
          </div>
        </div>
        <div className="insights-chart">
          <span style={{ height: "42%" }} />
          <span style={{ height: "68%" }} />
          <span style={{ height: "55%" }} />
          <span style={{ height: "82%" }} />
          <span style={{ height: "61%" }} />
          <span style={{ height: "74%" }} />
        </div>
        <div className="insights-table">
          <div className="insights-row header">
            <span />
            <span />
            <span />
          </div>
          <div className="insights-row">
            <span />
            <span />
            <span className="pill" />
          </div>
          <div className="insights-row">
            <span />
            <span />
            <span className="pill muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="proyectos" className="section">
      <div className="container-page">
        <div className="section-heading">
          <p className="eyebrow">Proyectos</p>
          <h2 className="section-title">
            Trabajo aplicado a sitios, plataformas y flujos reales.
          </h2>
          <p className="section-copy">
            Una muestra de participaciones profesionales en desarrollo web, estructura visual e
            interfaces para operación digital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <article key={project.name} className="project-card">
              {project.visual === "insights" && <InsightsVisual />}

              <p className="text-sm font-medium text-slate-500">
                Proyecto 0{index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{project.name}</h3>
              <p className="mt-5 text-sm leading-7 text-slate-400">{project.description}</p>

              {project.links && project.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Rol
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{project.role}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.capabilities.map((capability) => (
                  <span key={capability} className="tag">
                    {capability}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
