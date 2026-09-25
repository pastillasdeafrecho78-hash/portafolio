"use client";

import { useEffect, useState } from "react";
import { GlassCTA } from "@/components/effects/GlassCTA";
import { Header } from "@/components/layout/Header";
import { WhatsAppBridge } from "@/components/onboarding/WhatsAppBridge";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import { ProcesoVideoPlayer } from "@/components/proceso/ProcesoVideoPlayer";
import { type InterestId, type OnboardingIconKey } from "@/lib/constants";
import {
  markHandoffBridgeDone,
  readHandoff,
  type HandoffPayload,
} from "@/lib/handoff";

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

function tipsFor(interest: InterestId | null): string[] {
  if (interest === "landing") {
    return [
      "Una o dos webs que te gusten (aunque no sean del mismo giro).",
      "Si ya tienes dominio o nombre de marca.",
      "Qué tiene que poder hacer alguien que te visita.",
    ];
  }
  if (interest === "chats") {
    return [
      "De dónde llegan hoy los mensajes (WhatsApp, web, Instagram…).",
      "Qué quieres que pase después: responder, agendar o registrar.",
      "Un ejemplo de conversación real, aunque sea informal.",
    ];
  }
  if (interest === "panel") {
    return [
      "Quién entra al panel y qué necesita ver primero.",
      "Si ya hay una hoja de cálculo o sistema que hoy sostienen.",
      "La acción más urgente: pedidos, usuarios o un reporte.",
    ];
  }
  return [
    "Cuéntanos el problema en una frase.",
    "Qué intentaste hasta ahora (aunque no haya funcionado).",
    "Para cuándo te gustaría tener algo usable.",
  ];
}

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
  const tips = tipsFor(handoff.interest);

  return (
    <section className="wait-stage" aria-label="Mientras te respondemos">
      <div className="wait-stage__inner wait-stage__inner--video">
        <PanelMark icon="chat" />
        <h1 className="wait-stage__title">
          {firstName ? `${firstName}, mientras te respondemos` : "Mientras te respondemos"}
        </h1>
        <p className="wait-stage__lede">
          Mientras alguien te atiende, esto ayuda a que la conversación sea corta y
          clara.
        </p>

        {pick ? (
          <div className="wait-stage__pick">
            <PickChip label={detail ? `${pick} · ${detail}` : pick} />
          </div>
        ) : null}

        <ProcesoVideoPlayer videoId={handoff.videoId} />

        <div className="wait-tips">
          <p className="wait-tips__label">Para que la charla fluya</p>
          <ul className="wait-tips__list">
            {tips.map((tip) => (
              <li key={tip} className="wait-tips__item">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {handoff.waUrl ? (
          <div className="wait-stage__cta">
            <GlassCTA href={handoff.waUrl} external>
              Volver a WhatsApp
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

/** /proceso — bridge ritual then waiting lounge, or cold entry. */
export function WaitingExperience() {
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);
  const [ready, setReady] = useState(false);
  const [showBridge, setShowBridge] = useState(false);

  useEffect(() => {
    const data = readHandoff();
    setHandoff(data);
    setShowBridge(Boolean(data && !data.bridgeDone && data.waUrl));
    setReady(true);
  }, []);

  const finishBridge = () => {
    markHandoffBridgeDone();
    setHandoff((prev) => (prev ? { ...prev, bridgeDone: true } : prev));
    setShowBridge(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main
        id="main"
        className={
          showBridge ? "proceso-main proceso-main--bridge" : "proceso-main"
        }
      >
        {!ready ? null : showBridge && handoff ? (
          <WhatsAppBridge
            waUrl={handoff.waUrl}
            name={handoff.name}
            onFinished={finishBridge}
          />
        ) : handoff ? (
          <WaitingBody handoff={handoff} />
        ) : (
          <ColdCatalog />
        )}
      </main>
    </>
  );
}
