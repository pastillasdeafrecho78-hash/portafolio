"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ONBOARDING_FAMILIES,
  type OnboardingLeaf,
  type OnboardingFamily,
  type OnboardingIconKey,
} from "@/lib/constants";
import { useAppleGlass } from "@/hooks/useAppleGlass";
import { GlassOption } from "@/components/effects/GlassOption";

type Props = {
  resetKey?: string | number;
  onPick: (leaf: OnboardingLeaf) => void;
  onOtherSubmit: (text: string) => void;
};

type Phase =
  | "idle"
  | "text-out"
  | "collapse"
  | "expand"
  | "text-in"
  | "children"
  | "other-text-out"
  | "other-collapse"
  | "other-rise"
  | "other-write";

const OTHER_HUB = 3;

const MS = {
  textOut: 440,
  collapse: 540,
  expand: 540,
  textIn: 460,
  rise: 520,
} as const;

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

function measureToHub(wraps: HTMLElement[], hub: number) {
  const hubEl = wraps[hub];
  if (!hubEl) return;
  const hubRect = hubEl.getBoundingClientRect();
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
 * Tres familias + Otro. Secuencia: texto → 0 → colapsar al hub → volver → texto nuevo.
 * Misma altura y espaciado; solo texto principal (sin subtítulos).
 */
export function FamilyInterestPicker({ resetKey = 0, onPick, onOtherSubmit }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [hubIndex, setHubIndex] = useState<number | null>(null);
  const [leaves, setLeaves] = useState<readonly OnboardingLeaf[] | null>(null);
  const [slotLabels, setSlotLabels] = useState(() =>
    ONBOARDING_FAMILIES.map((f) => f.label),
  );
  const [slotIcons, setSlotIcons] = useState<OnboardingIconKey[]>(() =>
    ONBOARDING_FAMILIES.map((f) => f.icon),
  );
  const [text, setText] = useState("");
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [returning, setReturning] = useState(false);
  const otherOriginRef = useRef<"idle" | "children">("idle");
  const savedHubRef = useRef<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timersRef = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useAppleGlass<HTMLDivElement>({ preset: "cta", shape: "pill" });
  /* Atrás: CSS glass only — WebGL circle dejaba una esfera fantasma */

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
    setPhase("idle");
    setHubIndex(null);
    setLeaves(null);
    setSlotLabels(ONBOARDING_FAMILIES.map((f) => f.label));
    setSlotIcons(ONBOARDING_FAMILIES.map((f) => f.icon));
    setText("");
    setLockedHeight(null);
    setReturning(false);
    wrapRefs.current.forEach((el) => {
      el?.style.removeProperty("--tx");
      el?.style.removeProperty("--ty");
      el?.style.removeProperty("--rise-y");
    });
  }, [resetKey, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useLayoutEffect(() => {
    if (phase !== "collapse" && phase !== "other-collapse") return;
    const hub = phase === "other-collapse" ? OTHER_HUB : hubIndex;
    if (hub == null) return;
    const wraps =
      phase === "other-collapse"
        ? ([0, 1, 2, OTHER_HUB]
            .map((i) => wrapRefs.current[i])
            .filter(Boolean) as HTMLDivElement[])
        : (wrapRefs.current.slice(0, 3).filter(Boolean) as HTMLDivElement[]);
    const hubInList =
      phase === "other-collapse" ? wraps.length - 1 : hub;
    measureToHub(wraps, hubInList);
  }, [phase, hubIndex]);

  useLayoutEffect(() => {
    if (phase !== "other-rise") return;
    const root = rootRef.current;
    const hub = wrapRefs.current[OTHER_HUB];
    if (!root || !hub) return;
    const rootRect = root.getBoundingClientRect();
    const hubRect = hub.getBoundingClientRect();
    const rise =
      rootRect.top + rootRect.height / 2 - (hubRect.top + hubRect.height / 2);
    [0, 1, 2, OTHER_HUB].forEach((i) => {
      wrapRefs.current[i]?.style.setProperty("--rise-y", `${rise}px`);
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== "other-write") return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [phase]);

  const lockLayoutHeight = () => {
    const h = rootRef.current?.getBoundingClientRect().height;
    if (h && h > 0) setLockedHeight(h);
  };

  const busy =
    phase !== "idle" && phase !== "children" && phase !== "other-write";

  const runFamilyExpand = (index: number, family: OnboardingFamily) => {
    if (busy) return;
    lockLayoutHeight();
    setReturning(false);
    setHubIndex(index);
    setPhase("text-out");

    schedule(() => setPhase("collapse"), MS.textOut);
    schedule(() => setPhase("expand"), MS.textOut + MS.collapse);
    schedule(() => {
      setSlotLabels(family.children.map((c) => c.label));
      setSlotIcons(family.children.map((c) => c.icon));
      setLeaves(family.children);
      setPhase("text-in");
    }, MS.textOut + MS.collapse + MS.expand);
    schedule(
      () => setPhase("children"),
      MS.textOut + MS.collapse + MS.expand + MS.textIn,
    );
  };

  /** Hijos → familias: misma animación de colapso/expansión al hub. */
  const runFamilyBack = () => {
    if (phase !== "children" || hubIndex == null || busy) return;
    lockLayoutHeight();
    setReturning(true);
    setPhase("text-out");

    schedule(() => setPhase("collapse"), MS.textOut);
    schedule(() => setPhase("expand"), MS.textOut + MS.collapse);
    schedule(() => {
      setSlotLabels(ONBOARDING_FAMILIES.map((f) => f.label));
      setSlotIcons(ONBOARDING_FAMILIES.map((f) => f.icon));
      setLeaves(null);
      setPhase("text-in");
    }, MS.textOut + MS.collapse + MS.expand);
    schedule(() => {
      setPhase("idle");
      setReturning(false);
      setHubIndex(null);
      setLockedHeight(null);
      wrapRefs.current.forEach((el) => {
        el?.style.removeProperty("--tx");
        el?.style.removeProperty("--ty");
      });
    }, MS.textOut + MS.collapse + MS.expand + MS.textIn);
  };

  const runOther = () => {
    if (busy) return;
    if (phase !== "idle" && phase !== "children") return;
    lockLayoutHeight();
    otherOriginRef.current = phase === "children" ? "children" : "idle";
    savedHubRef.current = hubIndex;
    setHubIndex(OTHER_HUB);
    setPhase("other-text-out");

    schedule(() => setPhase("other-collapse"), MS.textOut);
    schedule(() => setPhase("other-rise"), MS.textOut + MS.collapse);
    schedule(
      () => setPhase("other-write"),
      MS.textOut + MS.collapse + MS.rise,
    );
  };

  /** Escritura Otro → opciones previas (familias o hijos). */
  const runOtherBack = () => {
    if (phase !== "other-write") return;
    clearTimers();
    setText("");
    setReturning(true);
    setPhase("other-rise");

    schedule(() => {
      wrapRefs.current.forEach((el) => {
        el?.style.removeProperty("--tx");
        el?.style.removeProperty("--ty");
        el?.style.removeProperty("--rise-y");
      });
      const dest = otherOriginRef.current;
      if (dest === "idle") {
        setSlotLabels(ONBOARDING_FAMILIES.map((f) => f.label));
        setSlotIcons(ONBOARDING_FAMILIES.map((f) => f.icon));
        setLeaves(null);
        setHubIndex(null);
      } else {
        setHubIndex(savedHubRef.current);
      }
      setPhase("text-in");
    }, 180);

    schedule(() => {
      setPhase(otherOriginRef.current === "children" ? "children" : "idle");
      setReturning(false);
      setLockedHeight(null);
    }, 180 + MS.textIn);
  };

  const submitOther = () => {
    const v = text.trim();
    if (v.length < 2) return;
    onOtherSubmit(v);
  };

  const onSlotClick = (slot: number) => {
    if (phase === "children" && leaves?.[slot]) {
      onPick(leaves[slot]);
      return;
    }
    if (phase !== "idle") return;
    const family = ONBOARDING_FAMILIES[slot];
    if (!family) return;
    runFamilyExpand(slot, family);
  };

  const showCompose = phase === "other-write";

  const labelState = () => {
    if (phase === "text-in") return "is-revealing";
    if (
      phase === "text-out" ||
      phase === "collapse" ||
      phase === "expand" ||
      phase === "other-text-out" ||
      phase === "other-collapse" ||
      phase === "other-rise"
    ) {
      return "is-hidden";
    }
    return "";
  };

  return (
    <div
      ref={rootRef}
      className={`family-picker onboard-q-options family-picker--${phase}${returning ? " is-returning" : ""}`}
      style={lockedHeight ? { minHeight: `${lockedHeight}px` } : undefined}
    >
      <div className="family-picker__slots onboard-q-options__stack" aria-hidden={showCompose}>
        {[0, 1, 2].map((slot) => (
          <div
            key={`slot-${slot}`}
            className="family-picker__slot"
            style={{ "--slot-i": slot } as CSSProperties}
          >
            <div
              ref={(el) => {
                wrapRefs.current[slot] = el;
              }}
              className="family-picker__pill-wrap"
            >
              <GlassOption
                className={`family-picker__option ${labelState()}`.trim()}
                style={{ "--slot-i": slot } as CSSProperties}
                icon={slotIcons[slot]}
                onClick={() => onSlotClick(slot)}
              >
                {slotLabels[slot] ?? ""}
              </GlassOption>
            </div>
          </div>
        ))}
      </div>

      <div className="family-picker__other-row" aria-hidden={showCompose}>
        <div
          ref={(el) => {
            wrapRefs.current[OTHER_HUB] = el;
          }}
          className="family-picker__pill-wrap family-picker__pill-wrap--other"
        >
          <GlassOption
            className="family-picker__option family-picker__option--hub"
            icon="pen"
            onClick={() => {
              if (phase !== "idle" && phase !== "children") return;
              runOther();
            }}
          >
            Otro
          </GlassOption>
        </div>
      </div>

      {(phase === "children" || returning) && !showCompose ? (
        <button
          type="button"
          className={`family-picker__back${returning ? " is-returning" : ""}`}
          aria-label="Volver a las opciones anteriores"
          disabled={phase !== "children"}
          onClick={runFamilyBack}
        >
          <BackChevron />
          <span className="family-picker__back-label">Atrás</span>
        </button>
      ) : null}

      {showCompose ? (
        <>
          <div
            ref={shellRef}
            className="option-compose family-picker__compose is-ready"
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
                  submitOther();
                }
              }}
              placeholder="Cuéntanos qué necesitas…"
              enterKeyHint="send"
              autoComplete="off"
            />
            <button
              type="button"
              className="option-compose__send"
              aria-label="Enviar"
              disabled={text.trim().length < 2}
              onClick={submitOther}
            >
              <ArrowIcon />
            </button>
          </div>
          <button
            type="button"
            className={`family-picker__back${returning ? " is-returning" : ""}`}
            aria-label="Volver a las opciones anteriores"
            disabled={returning}
            onClick={runOtherBack}
          >
            <BackChevron />
            <span className="family-picker__back-label">Atrás</span>
          </button>
        </>
      ) : null}
    </div>
  );
};
