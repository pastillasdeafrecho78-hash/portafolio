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

        <div className="projects-grid">
          {PROJECTS.map((project, index) => {
            const primaryLink = project.links?.[0];

            return (
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
                      className={`project-preview-image ${project.previewFit === "contain" ? "contain" : ""}`}
                    />
                    <div className="project-preview-shade" aria-hidden="true" />
                  </div>
                )}

                <div className="project-card-content">
                  <p className="project-index">Proyecto 0{index + 1}</p>
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-meta">
                    <p className="project-meta-label">Rol</p>
                    <p className="project-meta-copy">{project.role}</p>
                  </div>

                  <div className="project-tags">
                    {project.capabilities.map((capability) => (
                      <span key={capability} className="tag">
                        {capability}
                      </span>
                    ))}
                  </div>

                  {primaryLink && (
                    <div className="project-card-actions">
                      <a
                        href={primaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`project-cta ${project.featured ? "project-cta-featured" : ""}`}
                      >
                        {primaryLink.label}
                        <span className="project-cta-icon" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
