import { PROJECTS } from "@/lib/constants";

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
              <p className="text-sm font-medium text-slate-500">
                Proyecto 0{index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{project.name}</h3>
              <p className="mt-5 text-sm leading-7 text-slate-400">{project.description}</p>
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
