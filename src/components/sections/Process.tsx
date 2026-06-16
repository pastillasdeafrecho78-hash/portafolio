import { PROCESS_STEPS } from "@/lib/constants";

export function Process() {
  return (
    <section id="proceso" className="section section-muted">
      <div className="container-page">
        <div className="section-heading">
          <p className="eyebrow">Cómo trabajo</p>
          <h2 className="section-title">
            Un proceso directo para pasar de idea a sitio publicado.
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          {PROCESS_STEPS.map((step, index) => (
            <article key={step.title} className="process-row">
              <div className="process-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
