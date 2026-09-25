"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useAppleGlass } from "@/hooks/useAppleGlass";
import { GlassOption } from "@/components/effects/GlassOption";
import type { OnboardingIconKey } from "@/lib/constants";

export type StackOption = { id: string; label: string; icon?: OnboardingIconKey };

type Props = {
  options: readonly StackOption[];
  otherId?: string;
  onPick: (id: string) => void;
  onOtherSubmit: (text: string) => void;
  resetKey?: string | number;
};

type Phase = "list" | "text-out" | "collapse" | "rise" | "write";

const MS = { textOut: 320, collapse: 540, rise: 520 } as const;

function BackChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="family-picker__back-icon">
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="option-compose__arrow">
      <path
        d="M5 12h12.5M13 6.5 18.5 12 13 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function measureToHub(wraps: HTMLElement[], hub: HTMLElement) {
  const hubRect = hub.getBoundingClientRect();
  const hx = hubRect.left + hubRect.width / 2;
  const hy = hubRect.top + hubRect.height / 2;
  wraps.forEach((el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    el.style.setProperty("--tx", `${hx - cx}px`);
    el.style.setProperty("--ty", `${hy - cy}px`);
  });
}

/**
 * Opciones en lista + “Otro” en fila aparte.
 * Al elegir Otro, las pills vuelan hacia ese botón (no al centro).
 */
export function CollapsingOptions({
  options,
  otherId = "otro",
  onPick,
  onOtherSubmit,
  resetKey = 0,
}: Props) {
  const [phase, setPhase] = useState<Phase>("list");
  const [text, setText] = useState("");
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const primaryWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const otherWrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);
  const shellRef = useAppleGlass<HTMLDivElement>({ preset: "cta", shape: "pill" });

  const primaryOptions = options.filter((o) => o.id !== otherId);
  const otherOption = options.find((o) => o.id === otherId) ?? options[options.length - 1];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    clearTimers();
    setPhase("list");
    setText("");
    setLockedHeight(null);
    primaryWrapRefs.current.forEach((el) => {
      el?.style.removeProperty("--tx");
      el?.style.removeProperty("--ty");
      el?.style.removeProperty("--rise-y");
    });
    otherWrapRef.current?.style.removeProperty("--rise-y");
  }, [resetKey, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (phase !== "write") return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "collapse") return;
    const hub = otherWrapRef.current;
    if (!hub) return;
    const wraps = primaryWrapRefs.current.filter(Boolean) as HTMLDivElement[];
    measureToHub(wraps, hub);
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "rise") return;
    const root = rootRef.current;
    const hub = otherWrapRef.current;
    if (!root || !hub) return;
    const rootRect = root.getBoundingClientRect();
    const hubRect = hub.getBoundingClientRect();
    const rise =
      rootRect.top + rootRect.height / 2 - (hubRect.top + hubRect.height / 2);
    hub.style.setProperty("--rise-y", `${rise}px`);
    primaryWrapRefs.current.forEach((el) => {
      el?.style.setProperty("--rise-y", `${rise}px`);
    });
  }, [phase]);

  const startOther = () => {
    if (phase !== "list") return;
    const h = rootRef.current?.getBoundingClientRect().height;
    if (h) setLockedHeight(h);
    setPhase("text-out");
    schedule(() => setPhase("collapse"), MS.textOut);
    schedule(() => setPhase("rise"), MS.textOut + MS.collapse);
    schedule(() => setPhase("write"), MS.textOut + MS.collapse + MS.rise);
  };

  const backFromWrite = () => {
    if (phase !== "write") return;
    clearTimers();
    setText("");
    setPhase("rise");
    schedule(() => {
      primaryWrapRefs.current.forEach((el) => {
        el?.style.removeProperty("--tx");
        el?.style.removeProperty("--ty");
        el?.style.removeProperty("--rise-y");
      });
      otherWrapRef.current?.style.removeProperty("--rise-y");
      setPhase("list");
      setLockedHeight(null);
    }, 380);
  };

  const submit = () => {
    const v = text.trim();
    if (v.length < 2) return;
    onOtherSubmit(v);
  };

  const showCompose = phase === "write";
  const collapsing =
    phase === "text-out" || phase === "collapse" || phase === "rise";

  return (
    <div
      ref={rootRef}
      className={`option-stack option-stack--${phase} onboard-q-options`}
      style={lockedHeight ? { minHeight: `${lockedHeight}px` } : undefined}
    >
      <div className="onboard-q-options__stack" aria-hidden={showCompose}>
        {primaryOptions.map((opt, i) => (
          <div key={opt.id} className="onboard-q-options__row">
            <div
              ref={(el) => {
                primaryWrapRefs.current[i] = el;
              }}
              className="option-stack__pill-wrap"
            >
              <GlassOption
                className={`onboard-panel__option onboard-q-option${collapsing ? " is-label-hidden" : ""}`}
                style={{ "--reveal-i": i } as CSSProperties}
                icon={opt.icon}
                onClick={() => {
                  if (phase !== "list") return;
                  onPick(opt.id);
                }}
              >
                {opt.label}
              </GlassOption>
            </div>
          </div>
        ))}
      </div>

      <div className="onboard-q-options__other" aria-hidden={showCompose}>
        <div ref={otherWrapRef} className="option-stack__pill-wrap option-stack__pill-wrap--hub">
          <GlassOption
            className="onboard-panel__option onboard-q-option"
            style={{ "--reveal-i": primaryOptions.length } as CSSProperties}
            icon={otherOption.icon ?? "pen"}
            onClick={startOther}
          >
            {otherOption.label}
          </GlassOption>
        </div>
      </div>

      {showCompose ? (
        <>
          <div
            ref={shellRef}
            className="option-compose is-ready"
            role="group"
            aria-label="Escribe tu respuesta"
          >
            <input
              ref={inputRef}
              className="option-compose__input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Cuéntanos…"
              enterKeyHint="send"
              autoComplete="off"
            />
            <button
              type="button"
              className="option-compose__send"
              aria-label="Enviar"
              disabled={text.trim().length < 2}
              onClick={submit}
            >
              <ArrowIcon />
            </button>
          </div>
          <button
            type="button"
            className="family-picker__back"
            aria-label="Volver a las opciones anteriores"
            onClick={backFromWrite}
          >
            <BackChevron />
            <span className="family-picker__back-label">Atrás</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
