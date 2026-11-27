"use client";

import { useEffect, useState } from "react";
import { GlassCTA } from "@/components/effects/GlassCTA";
import { Header } from "@/components/layout/Header";
import { ProcesoVideoPlayer } from "@/components/proceso/ProcesoVideoPlayer";
import { buildWhatsAppUrl } from "@/lib/constants";
import { readHandoff, type HandoffPayload } from "@/lib/handoff";
import styles from "./ProcessOverview.module.css";

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

  const [message, setMessage] = useState(() => {
    if (!handoff.waUrl) return "";
    return new URL(handoff.waUrl, window.location.origin).searchParams.get("text") ?? "";
  });

  return (
    <section className="wait-stage" aria-label="Tu proceso">
      <div className="wait-stage__inner wait-stage__inner--video">
        <h1 className="wait-stage__title">
          {firstName ? `${firstName}, mira el video` : "Mira el video"}
        </h1>
        <p className="wait-stage__lede">
          {handoff.waOptIn
            ? "Te cuenta cómo lo armamos. En un momento te llega un WhatsApp con este pedido."
            : "Te cuenta cómo lo armamos. Si quieres platicar del proyecto, puedes abrir tu mensaje en WhatsApp."}
        </p>

        {pick ? (
          <div className="wait-stage__pick">
            <PickChip label={detail ? `${pick} · ${detail}` : pick} />
          </div>
        ) : null}

        <ProcesoVideoPlayer videoId={handoff.videoId} />

        {handoff.waUrl ? (
          <div className="wait-stage__cta">
            <label className="onboard-contact__field">
              <span className="onboard-contact__label">Mensaje para WhatsApp</span>
              <textarea
                className="onboard-contact__input wait-message"
                rows={4}
                maxLength={1400}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            {message.trim() ? (
              <GlassCTA href={buildWhatsAppUrl(message.trim())} external>Abrir WhatsApp</GlassCTA>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProcessOverview() {
  return (
    <section className={styles.overview} aria-labelledby="proceso-titulo">
      <h1 id="proceso-titulo">Cómo trabajamos contigo</h1>
      <ol className={styles.steps}>
        <li>
          <h2>Nos cuentas qué necesitas</h2>
          <p>Platícanos qué quieres resolver y qué tienes hecho.</p>
        </li>
        <li>
          <h2>Acordamos qué vamos a hacer</h2>
          <p>Definimos qué incluye el proyecto, cuánto cuesta y cuándo puede estar listo.</p>
        </li>
        <li>
          <h2>Revisamos el avance contigo</h2>
          <p>Te mostramos lo que llevamos para ajustar detalles antes de la entrega.</p>
        </li>
      </ol>
      <GlassCTA href="/#cuestionario">Cuéntanos tu proyecto</GlassCTA>
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
          <ProcessOverview />
        )}
      </main>
    </>
  );
}
