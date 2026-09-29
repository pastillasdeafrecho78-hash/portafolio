"use client";

import { useEffect, useState } from "react";
import { GlassCTA } from "@/components/effects/GlassCTA";
import { Header } from "@/components/layout/Header";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import { ProcesoVideoPlayer } from "@/components/proceso/ProcesoVideoPlayer";
import { type OnboardingIconKey } from "@/lib/constants";
import { readHandoff, type HandoffPayload } from "@/lib/handoff";

const WORK_LINES = [
  {
    icon: "globe" as const,
    title: "Sitio web",
    desc: "Presencia clara: secciones, WhatsApp y publicación.",
  },
  {
    icon: "chat" as const,
    title: "Automatización de chats",
    desc: "Inbox o WhatsApp que responde o registra sin que estés pegado al chat.",
  },
  {
    icon: "dashboard" as const,
    title: "Panel o MVP",
    desc: "Una pantalla con lo esencial: pedidos, usuarios o reportes.",
  },
] as const;

function PanelMark({ icon }: { icon: OnboardingIconKey }) {
  return (
    <div className="wait-mark" aria-hidden>
      <OnboardingIcon id={icon} className="wait-mark__svg" />
    </div>
  );
}

function PickChip({ label }: { label: string }) {
  return (
    <div className="wait-chip" aria-label={`Elegiste ${label}`}>
      <span className="wait-chip__text">{label}</span>
    </div>
  );
}

function WaitingBody({ handoff }: { handoff: HandoffPayload }) {
  const firstName = handoff.name?.trim().split(/\s+/)[0] || null;
  const pick = handoff.interestLabel?.trim() || null;
  const detail =
    handoff.followUpLabel && handoff.followUpLabel !== handoff.interestLabel
      ? handoff.followUpLabel.trim()
      : null;

  return (
    <section className="wait-stage" aria-label="Tu proceso">
      <div className="wait-stage__inner wait-stage__inner--video">
        <h1 className="wait-stage__title">
          {firstName ? `${firstName}, mira el video` : "Mira el video"}
        </h1>
        <p className="wait-stage__lede">
          Te cuenta cómo lo armamos. En un momento te llega un WhatsApp con este
          pedido — ahí platicamos las dudas.
        </p>

        {pick ? (
          <div className="wait-stage__pick">
            <PickChip label={detail ? `${pick} · ${detail}` : pick} />
          </div>
        ) : null}

        <ProcesoVideoPlayer videoId={handoff.videoId} />

        {handoff.waUrl ? (
          <div className="wait-stage__cta">
            <GlassCTA href={handoff.waUrl} external>
              Abrir WhatsApp
            </GlassCTA>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ColdCatalog() {
  return (
    <section className="wait-stage wait-stage--cold" aria-label="Qué hacemos">
      <div className="wait-stage__inner">
        <PanelMark icon="scan" />
        <h1 className="wait-stage__title">Tres trabajos. Una charla.</h1>
        <p className="wait-stage__lede">
          Sitio, chats o panel. Alcance y cómo arrancar lo cerramos cuando ya estamos
          hablando.
        </p>

        <ul className="wait-offers">
          {WORK_LINES.map((line) => (
            <li key={line.title} className="wait-offers__item">
              <span className="wait-offers__icon" aria-hidden>
                <OnboardingIcon id={line.icon} className="wait-offers__svg" />
              </span>
              <span className="wait-offers__body">
                <span className="wait-offers__name">{line.title}</span>
                <span className="wait-offers__desc">{line.desc}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="wait-stage__cta">
          <GlassCTA href="/">Empezar</GlassCTA>
        </div>
      </div>
    </section>
  );
}

/** /proceso — video after contact, or cold entry without handoff. */
export function WaitingExperience() {
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHandoff(readHandoff());
    setReady(true);
  }, []);

  return (
    <>
      <Header />
      <main id="main" className="proceso-main">
        {!ready ? null : handoff ? (
          <WaitingBody handoff={handoff} />
        ) : (
          <ColdCatalog />
        )}
      </main>
    </>
  );
}
