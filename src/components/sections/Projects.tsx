import Image from "next/image";
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
            Proyectos tangibles donde se ve la landing, la plataforma y la operación digital
            funcionando en producción.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <article
              key={project.name}
              className={`project-card ${project.featured ? "project-card-featured" : ""}`}
            >
              {project.preview && (
                <div className="project-preview">
                  <Image
                    src={project.preview}
                    alt={`Vista del proyecto ${project.name}`}
                    fill
                    sizes="(min-width: 1024px) 540px, 92vw"
                    className={`project-preview-image ${project.featured ? "" : "contain"}`}
                  />
                </div>
              )}

              {project.logo && (
                <div className="project-brand">
                  <Image
                    src={project.logo}
                    alt={project.name}
                    width={project.logoWidth ?? 180}
                    height={project.logoHeight ?? 48}
                    className="project-brand-logo"
                  />
                </div>
              )}

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
