import Image from "next/image";
import { PROJECTS } from "@/lib/constants";
import { GlassCTA } from "@/components/effects/GlassCTA";

export function Projects() {
  return (
    <section id="proyectos" className="section section-rule">
      <div className="container-page">
        <div className="section-heading">
          <p className="section-label">Proyectos</p>
          <h2 className="section-title">Cinco piezas distintas.</h2>
          <p className="section-copy">
            Una plataforma en producción y cuatro verticales: inmobiliaria, energía, automatización
            y demo agéntica.
          </p>
        </div>

        <div className="projects-stack">
          {PROJECTS.map((project, index) => {
            const primaryLink = project.links?.[0];

            return (
              <article key={project.name} className="project-block">
                {project.preview ? (
                  <div
                    className={`project-media ${project.previewFit === "contain" ? "is-contain" : ""}`}
                  >
                    <Image
                      src={project.preview}
                      alt={`Vista del proyecto ${project.name}`}
                      fill
                      sizes="(min-width: 900px) 520px, 92vw"
                    />
                  </div>
                ) : (
                  <div className="project-media project-media--mark" aria-hidden="true">
                    <span>{project.name}</span>
                  </div>
                )}

                <div>
                  <p className="project-index">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-role">
                    <p className="project-role-label">Rol</p>
                    <p>{project.role}</p>
                  </div>

                  <div className="project-tags">
                    {project.capabilities.map((capability) => (
                      <span key={capability}>{capability}</span>
                    ))}
                  </div>

                  {primaryLink && (
                    <div className="project-cta-wrap">
                      <GlassCTA href={primaryLink.href} external size="small">
                        {primaryLink.label}
                      </GlassCTA>
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
