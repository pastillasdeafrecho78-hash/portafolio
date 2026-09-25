import { PROCESS_STEPS } from "@/lib/constants";

export function Process() {
  return (
    <section id="proceso" className="section section-rule">
      <div className="container-page">
        <div className="section-heading">
          <p className="section-label">Proceso</p>
          <h2 className="section-title">Cómo trabajamos</h2>
          <p className="section-copy">
            Casi todo se cierra por WhatsApp o correo. Las llamadas son opcionales.
          </p>
        </div>

        <div className="process-list">
          {PROCESS_STEPS.map((step, index) => (
            <article key={step.title} className="process-item">
              <div className="process-num">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
