"use client";

import { useEffect, useRef, useState } from "react";
import { GlassButton } from "@/components/effects/GlassCTA";

type Props = {
  waUrl: string;
  name?: string;
  onFinished: () => void;
};

const RING_MS = 8000;

/**
 * Read pause: ring fills + check, then stays until the person opens WhatsApp.
 */
export function WhatsAppBridge({ waUrl, name, onFinished }: Props) {
  const [phase, setPhase] = useState<"filling" | "ready">("filling");
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 400 : RING_MS;
    const t = window.setTimeout(() => setPhase("ready"), delay);
    return () => window.clearTimeout(t);
  }, []);

  const greeting = name?.trim()
    ? `${name.trim().split(/\s+/)[0]}, un paso más`
    : "Un paso más";

  return (
    <section className="wa-bridge" aria-label="Abrir WhatsApp" aria-live="polite">
      <div className="wa-bridge__inner">
        <div
          className={`wa-bridge__mark${phase === "ready" ? " is-ready" : ""}`}
          aria-hidden
        >
          <svg className="wa-bridge__svg" viewBox="0 0 120 120" fill="none">
            <circle className="wa-bridge__track" cx="60" cy="60" r="52" />
            <circle className="wa-bridge__progress" cx="60" cy="60" r="52" />
            <path
              className="wa-bridge__check"
              d="M38 62.5 L52.5 77 L84 44"
              pathLength={1}
            />
          </svg>
        </div>

        <h1 className="wa-bridge__title">{greeting}</h1>
        <p className="wa-bridge__copy">
          Cuando estés listo, abre WhatsApp, manda el mensaje y regresa aquí. Mientras
          alguien te atiende te dejamos qué sigue.
        </p>

        <div className="wa-bridge__actions">
          <GlassButton
            variant="amber"
            disabled={phase !== "ready"}
            className={phase !== "ready" ? "wa-bridge__cta--wait" : ""}
            onClick={() => {
              window.open(waUrl, "_blank", "noopener,noreferrer");
              finish();
            }}
          >
            WhatsApp
          </GlassButton>
          {phase === "ready" ? (
            <button type="button" className="wa-bridge__skip" onClick={finish}>
              Ya mandé el mensaje
            </button>
          ) : (
            <p className="wa-bridge__wait-hint">Espera a que se complete el círculo</p>
          )}
        </div>
      </div>
    </section>
  );
}
