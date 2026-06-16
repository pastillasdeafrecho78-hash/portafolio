import { TRUST_POINTS } from "@/lib/constants";

export function Benefits() {
  return (
    <section id="confianza" className="section">
      <div className="container-page">
        <div className="trust-panel">
          <div>
            <p className="eyebrow">Confianza</p>
            <h2 className="section-title max-w-3xl">
              Diseñado para negocios que necesitan vender, responder rápido y verse profesionales.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {TRUST_POINTS.map((point) => (
              <div key={point} className="trust-item">
                <span aria-hidden="true" className="trust-dot" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
