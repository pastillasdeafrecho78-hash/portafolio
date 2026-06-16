import { PLATFORMS_INSIGHTS } from "@/lib/constants";

function InsightsVisualLarge() {
  return (
    <div className="platforms-insights-visual" aria-hidden="true">
      <div className="insights-topbar">
        <span />
        <span />
        <span />
        <p>operación / insights</p>
      </div>
      <div className="platforms-insights-body">
        <div className="insights-metrics platforms-metrics">
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
          <div className="insights-metric">
            <span className="insights-metric-label" />
            <span className="insights-metric-value accent" />
          </div>
        </div>
        <div className="platforms-insights-main">
          <div className="insights-chart platforms-chart">
            <span style={{ height: "38%" }} />
            <span style={{ height: "62%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "78%" }} />
            <span style={{ height: "55%" }} />
            <span style={{ height: "70%" }} />
            <span style={{ height: "84%" }} />
            <span style={{ height: "58%" }} />
          </div>
          <div className="insights-table platforms-table">
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
            <div className="insights-row">
              <span />
              <span />
              <span className="pill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlatformsInsights() {
  return (
    <section id="plataformas" className="section section-muted platforms-section">
      <div className="container-page platforms-layout">
        <div className="platforms-header">
          <p className="eyebrow">{PLATFORMS_INSIGHTS.eyebrow}</p>
          <h2 className="section-title max-w-4xl">{PLATFORMS_INSIGHTS.title}</h2>
          <p className="section-copy mt-5 max-w-3xl">{PLATFORMS_INSIGHTS.description}</p>
        </div>

        <div className="platforms-visual-wrap">
          <InsightsVisualLarge />
        </div>

        <div className="platforms-cards">
          {PLATFORMS_INSIGHTS.points.map((point) => (
            <article key={point.title} className="platforms-card">
              <span className="platforms-card-dot" aria-hidden="true" />
              <h3 className="text-base font-semibold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
