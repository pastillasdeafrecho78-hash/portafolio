"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCTA, GlassSurface } from "@/components/effects/GlassCTA";
import { HeroToasts } from "@/components/agencia/HeroToasts";
import { MarketingDashboard } from "@/components/agencia/MarketingDashboard";
import { CodePanel } from "@/components/agencia/CodePanel";
import { ServerPanel } from "@/components/agencia/ServerPanel";
import { AgenciaCompare } from "@/components/agencia/AgenciaCompare";
import { EcosystemDiagram } from "@/components/agencia/EcosystemDiagram";
import { IaLayerDiagram } from "@/components/agencia/IaLayerDiagram";
import { AgentPipeline } from "@/components/agencia/AgentPipeline";
import { ToolMocks } from "@/components/agencia/ToolMocks";
import { FlowRibbon } from "@/components/agencia/FlowRibbon";
import { HostingCompare } from "@/components/agencia/HostingCompare";
import { MethodPath } from "@/components/agencia/MethodPath";
import { useAgenciaReveal } from "@/hooks/useAgenciaReveal";
import { AGENCIA, AGENCIA_WHATSAPP_URL } from "@/lib/agencia";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";
import { SITE } from "@/lib/constants";

export function AgenciaPage() {
  const a = AGENCIA;
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useAgenciaReveal(faqRef, { stagger: 0.06, y: 16 });

  useEffect(() => {
    const root = heroCopyRef.current;
    if (!root) return;
    const { gsap } = getGsap();
    const lines = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-h1 span"));
    const lead = root.querySelector<HTMLElement>(".agencia-lead");
    const actions = root.querySelector<HTMLElement>(".agencia-hero__actions");
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([lines, lead, actions], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(lines, { opacity: 0, y: 28 });
    gsap.set(lead, { opacity: 0, y: 16 });
    gsap.set(actions, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(lines, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 })
      .to(lead, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .to(actions, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");

    return () => {
      tl.kill();
      gsap.set([lines, lead, actions].filter(Boolean), { clearProps: "all", opacity: 1, y: 0 });
    };
  }, []);

  useEffect(() => {
    const root = contactRef.current;
    if (!root) return;
    const { gsap, ScrollTrigger } = getGsap();
    const panel = root.querySelector<HTMLElement>(".agencia-contact");
    if (prefersReducedMotion() || !panel) return;

    gsap.set(panel, { opacity: 0, scale: 0.96, y: 20 });
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(panel, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      <Header />
      <main id="main" className="agencia-page">
        <section className="agencia-section agencia-hero">
          <div className="container-page agencia-hero__grid">
            <div ref={heroCopyRef} className="agencia-hero__copy">
              <h1 className="agencia-h1">
                <span>Marketing que convierte.</span>
                <span>Tecnología que automatiza.</span>
                <span>IA que acelera.</span>
              </h1>
              <p className="agencia-lead">{a.hero.copy}</p>
              <div className="agencia-hero__actions">
                <GlassCTA href={AGENCIA_WHATSAPP_URL} external>
                  {a.hero.primaryCta}
                </GlassCTA>
                <Link href={a.hero.secondaryHref} className="agencia-link">
                  {a.hero.secondaryCta}
                </Link>
              </div>
            </div>
            <HeroToasts items={a.hero.toasts} />
          </div>
        </section>

        <section className="agencia-section" id="sistema">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.system.title}</h2>
              <p className="agencia-lead">{a.system.copy}</p>
            </header>
            <EcosystemDiagram nodes={a.system.nodes} />
          </div>
        </section>

        <section className="agencia-section" id="marketing">
          <div className="container-page agencia-split">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.marketing.title}</h2>
              <p className="agencia-lead">{a.marketing.copy}</p>
            </header>
            <MarketingDashboard kpis={a.marketing.kpis} channels={a.marketing.channels} />
          </div>
        </section>

        <section className="agencia-section" id="ia">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.ia.title}</h2>
              <p className="agencia-lead">{a.ia.copy}</p>
            </header>
            <IaLayerDiagram satellites={a.ia.satellites} />
          </div>
        </section>

        <section className="agencia-section" id="agentes">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.agents.title}</h2>
              <p className="agencia-lead">{a.agents.copy}</p>
            </header>
            <AgentPipeline stages={a.agents.stages} />
            <div className="agencia-code-secondary">
              <CodePanel lines={a.agents.code} />
            </div>
          </div>
        </section>

        <section className="agencia-section" id="tecnologia">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.tools.title}</h2>
            </header>
            <ToolMocks items={a.tools.items} />
          </div>
        </section>

        <section className="agencia-section" id="flujo">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.flow.title}</h2>
            </header>
            <FlowRibbon steps={a.flow.ribbon} />
            <div className="agencia-flow-compare">
              <AgenciaCompare before={a.flow.before} after={a.flow.after} />
            </div>
          </div>
        </section>

        <section className="agencia-section" id="infraestructura">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.hosting.title}</h2>
              <p className="agencia-lead">{a.hosting.copy}</p>
            </header>
            <HostingCompare left={a.hosting.compare.left} right={a.hosting.compare.right} />
            <div className="agencia-host-console">
              <ServerPanel gauges={a.hosting.gauges} events={a.hosting.events} />
            </div>
          </div>
        </section>

        <section className="agencia-section" id="metodo">
          <div className="container-page">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.method.title}</h2>
            </header>
            <MethodPath steps={a.method.steps} />
          </div>
        </section>

        <section className="agencia-section" id="faq">
          <div className="container-page agencia-faq-wrap">
            <header className="agencia-head">
              <h2 className="agencia-h2">{a.faq.title}</h2>
            </header>
            <div ref={faqRef} className="agencia-faq">
              {a.faq.items.map((item) => (
                <GlassSurface
                  key={item.q}
                  as="article"
                  preset="panel"
                  className="agencia-faq__item"
                  data-reveal
                >
                  <details>
                    <summary>{item.q}</summary>
                    <div className="agencia-faq__body">
                      <p>{item.a}</p>
                    </div>
                  </details>
                </GlassSurface>
              ))}
            </div>
          </div>
        </section>

        <section className="agencia-section" id="contacto">
          <div ref={contactRef} className="container-page">
            <GlassSurface preset="panel" className="agencia-contact">
              <div>
                <h2 className="agencia-h2">{a.contact.title}</h2>
                <p className="agencia-lead">{a.contact.copy}</p>
                <dl className="agencia-contact__meta">
                  <div>
                    <dt>Correo</dt>
                    <dd>
                      <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>WhatsApp</dt>
                    <dd>
                      <a href={AGENCIA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                        {SITE.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <GlassCTA href={AGENCIA_WHATSAPP_URL} external>
                {a.contact.cta}
              </GlassCTA>
            </GlassSurface>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
