"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ONBOARDING_EXTRA_FOLLOWUP_LABELS,
  ONBOARDING_FOLLOWUPS,
  STORAGE_ONBOARDING,
  buildWhatsAppUrl,
  type InterestId,
  type OnboardingIconKey,
  type OnboardingLeaf,
} from "@/lib/constants";
import { DEFAULT_COUNTRY, formatInternational } from "@/lib/countries";
import { saveHandoff } from "@/lib/handoff";
import { resolveProcesoVideoId, resolveProcesoVideoIdFromInterest } from "@/lib/procesoVideos";
import { enqueueManyChatWelcome } from "@/lib/manychat";
import { GlassButton } from "@/components/effects/GlassCTA";
import { CollapsingOptions } from "@/components/onboarding/CollapsingOptions";
import { FamilyInterestPicker } from "@/components/onboarding/FamilyInterestPicker";
import { ContactStep, type Gender } from "@/components/onboarding/ContactStep";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import { useAppleGlass } from "@/hooks/useAppleGlass";

type Answers = {
  interest: InterestId | null;
  interestPickLabel: string;
  interestOther: string;
  interestIcon: OnboardingIconKey | null;
  /** Onboarding leaf id (sitio, whatsapp, …) or "otro" for free text. */
  leafId: string | null;
  followUp: string | null;
  followUpOther: string;
  followUpIcon: OnboardingIconKey | null;
  name: string;
  phone: string;
  countryIso: string;
  gender: Gender | null;
  waOptIn: boolean;
};

type Props = {
  active: boolean;
  onComplete: () => void;
};

function emptyAnswers(): Answers {
  return {
    interest: null,
    interestPickLabel: "",
    interestOther: "",
    interestIcon: null,
    leafId: null,
    followUp: null,
    followUpOther: "",
    followUpIcon: null,
    name: "",
    phone: "",
    countryIso: DEFAULT_COUNTRY.iso,
    gender: null,
    waOptIn: false,
  };
}

function interestLabel(a: Answers) {
  if (a.interestPickLabel.trim()) return a.interestPickLabel.trim();
  if (!a.interest) return "";
  if (a.interest === "other") return a.interestOther.trim() || "Otro";
  return a.interest;
}

function followUpLabel(a: Answers) {
  if (!a.interest || !a.followUp) return "";
  if (a.followUp === "otro") return a.followUpOther.trim() || "Otro";
  const fromExtra = ONBOARDING_EXTRA_FOLLOWUP_LABELS[a.followUp];
  if (fromExtra) return fromExtra;
  return (
    ONBOARDING_FOLLOWUPS[a.interest].options.find((o) => o.id === a.followUp)?.label ??
    a.followUp
  );
}

/** Free-text “Otro” in step 01 already answered what step 02 would ask. */
function skipsDetailStep(a: Answers) {
  return a.interest === "other" && a.followUp === "otro";
}

/** Adjective agreement for the WhatsApp blur — never spell out gender. */
function interestedPhrase(g: Gender | null) {
  if (g === "female") return "estoy interesada en";
  if (g === "male") return "estoy interesado en";
  return "me interesa";
}

function buildOnboardingWaUrl(a: Answers) {
  if (!a.interest || !a.followUp) return buildWhatsAppUrl("Hola Think Deep");
  const name = a.name.trim() || "…";
  const interest = interestLabel(a);
  const detail = followUpLabel(a);
  const parts = [
    `Hola Think Deep — soy ${name}`,
    `${interestedPhrase(a.gender)} ${interest}`,
    detail && detail !== interest ? `detalle: ${detail}` : null,
  ].filter(Boolean);
  return buildWhatsAppUrl(parts.join(". ") + ".");
}

function useInView(active: boolean, key: string | number | boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-inview");
    if (!active) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
          el.classList.add("is-inview");
        }
      },
      { threshold: [0.28, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, key]);

  return ref;
}

function AnsweredChip({
  label,
  icon,
  onChange,
  changeLabel = "Cambiar",
}: {
  label: string;
  icon?: OnboardingIconKey | null;
  onChange: () => void;
  changeLabel?: string;
}) {
  const valueRef = useAppleGlass<HTMLDivElement>({ preset: "cta", shape: "pill" });

  return (
    <div className="onboard-answered">
      <div ref={valueRef} className="onboard-answered__value" role="status">
        <span className="onboard-answered__value-inner">
          {icon ? (
            <span className="onboard-answered__icon" aria-hidden>
              <OnboardingIcon id={icon} className="glass-option__icon-svg" />
            </span>
          ) : null}
          <span className="onboard-answered__value-text">{label}</span>
        </span>
      </div>
      <GlassButton variant="amber" className="onboard-answered__change-btn" onClick={onChange}>
        {changeLabel}
      </GlassButton>
    </div>
  );
}

function PanelMark({ icon }: { icon: OnboardingIconKey }) {
  return (
    <div className="onboard-panel__mark" aria-hidden>
      <OnboardingIcon id={icon} className="onboard-panel__mark-svg" />
    </div>
  );
}

function ChevronIcon({ dir }: { dir: "up" | "down" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="onboard-nav__icon">
      {dir === "up" ? (
        <path
          d="M6.5 14.5 12 9l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M6.5 9.5 12 15l5.5-5.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function PanelNav({
  onUp,
  onDown,
  showDown,
}: {
  onUp: () => void;
  onDown?: () => void;
  showDown?: boolean;
}) {
  const upRef = useAppleGlass<HTMLButtonElement>({ preset: "cta", shape: "circle" });
  const downRef = useAppleGlass<HTMLButtonElement>({ preset: "cta", shape: "circle" });

  return (
    <>
      <button
        ref={upRef}
        type="button"
        className="onboard-nav onboard-nav--up"
        aria-label="Ir a la pregunta anterior"
        onClick={onUp}
      >
        <ChevronIcon dir="up" />
      </button>
      {showDown && onDown ? (
        <button
          ref={downRef}
          type="button"
          className="onboard-nav onboard-nav--down"
          aria-label="Ir a la siguiente pregunta"
          onClick={onDown}
        >
          <ChevronIcon dir="down" />
        </button>
      ) : null}
    </>
  );
}

/**
 * Panels stack in the page. Down past the unanswered step is blocked;
 * up is always free (hero + answered steps).
 */
export function OnboardingFlow({ active, onComplete }: Props) {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [stackReset, setStackReset] = useState(0);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const panel1 = useInView(active, "1");
  const skipDetail = skipsDetailStep(answers);
  const panel2 = useInView(
    active && !!answers.interest && !skipDetail,
    answers.interest ?? "2",
  );
  const panel3 = useInView(active && !!answers.followUp, answers.followUp ?? "3");

  const prevGate = useRef(1);

  // Drop any leftover draft from older builds — always start at 01
  useEffect(() => {
    try {
      sessionStorage.removeItem(STORAGE_ONBOARDING);
    } catch {
      /* ignore */
    }
  }, []);

  // Furthest unanswered step — this is the downward scroll ceiling
  const gateStep: 1 | 2 | 3 = !answers.interest ? 1 : !answers.followUp ? 2 : 3;

  const panelFor = (n: 1 | 2 | 3) => ({ 1: panel1, 2: panel2, 3: panel3 })[n].current;

  const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

  // After answering, snap down to the new panel (does not affect scroll-up)
  useEffect(() => {
    if (!active) return;
    if (gateStep < prevGate.current) {
      prevGate.current = gateStep;
      return;
    }
    if (gateStep === prevGate.current) return;

    let tries = 0;
    let raf = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const panel = panelFor(gateStep);
      tries += 1;
      if (!panel || panel.offsetHeight < 60) {
        if (tries < 40) raf = requestAnimationFrame(tick);
        return;
      }
      window.scrollTo({ top: docTop(panel), behavior: "auto" });
      prevGate.current = gateStep;
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- panel refs are stable
  }, [active, gateStep]);

  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    root.classList.add("is-onboarding");

    const gateTop = () => {
      const panel = panelFor(gateStep);
      if (!panel || panel.offsetHeight < 60) return null;
      return docTop(panel);
    };

    let lastY = window.scrollY;

    const clampDown = () => {
      const top = gateTop();
      if (top == null) return;
      if (window.scrollY > top + 1) {
        window.scrollTo({ top, behavior: "auto" });
      }
    };

    const magnetDown = () => {
      const top = gateTop();
      if (top == null) return;
      const y = window.scrollY;
      const ih = window.innerHeight;
      if (y > top - ih * 0.42 && y < top - 1) {
        window.scrollTo({ top, behavior: "auto" });
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY + 0.5;
      lastY = y;
      if (goingDown) magnetDown();
      clampDown();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;
      const top = gateTop();
      if (top == null) return;
      if (window.scrollY > top - window.innerHeight * 0.42 && window.scrollY < top - 1) {
        e.preventDefault();
        window.scrollTo({ top, behavior: "auto" });
        return;
      }
      if (window.scrollY >= top - 1) {
        e.preventDefault();
        if (window.scrollY > top + 1) window.scrollTo({ top, behavior: "auto" });
      }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY ?? touchY;
      const goingDown = currentY < touchY - 4;
      if (!goingDown) return;
      const top = gateTop();
      if (top == null) return;
      if (window.scrollY >= top - 1) e.preventDefault();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      root.classList.remove("is-onboarding");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- panel refs are stable
  }, [active, gateStep]);

  const scrollToStep = (n: 1 | 2 | 3) => {
    const panel = panelFor(n);
    if (!panel) return;
    window.scrollTo({ top: docTop(panel), behavior: "smooth" });
  };

  const scrollToHero = () => {
    document.documentElement.classList.remove("is-header-away");
    const panel = panel1.current;
    if (!panel) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const top = Math.max(0, docTop(panel) - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const clearFromInterest = () => {
    setAnswers((prev) => ({
      ...prev,
      interest: null,
      interestPickLabel: "",
      interestOther: "",
      interestIcon: null,
      leafId: null,
      followUp: null,
      followUpOther: "",
      followUpIcon: null,
    }));
    setStackReset((n) => n + 1);
    requestAnimationFrame(() => scrollToStep(1));
  };

  const clearFromFollowUp = () => {
    setAnswers((prev) => ({
      ...prev,
      followUp: null,
      followUpOther: "",
      followUpIcon: null,
    }));
    requestAnimationFrame(() => scrollToStep(2));
  };

  const finishWithWhatsApp = () => {
    const a = answersRef.current;
    const url = buildOnboardingWaUrl(a);
    const videoId = a.leafId
      ? resolveProcesoVideoId(a.leafId)
      : resolveProcesoVideoIdFromInterest(a.interest, a.followUp);
    saveHandoff({
      interest: a.interest,
      interestLabel: interestLabel(a),
      followUpLabel: followUpLabel(a),
      name: a.name.trim(),
      phone: a.phone.trim(),
      countryIso: a.countryIso,
      waUrl: url,
      leafId: a.leafId,
      videoId,
      waOptIn: a.waOptIn,
      bridgeDone: false,
    });
    // Fire-and-forget: /proceso y el puente wa.me continúan aunque ManyChat falle.
    void enqueueManyChatWelcome({
      name: a.name.trim(),
      whatsappE164: formatInternational(a.countryIso, a.phone).replace(/\D/g, ""),
      productLabel: interestLabel(a),
      videoId,
      waOptIn: a.waOptIn,
    });
    onComplete();
  };

  return (
    <section
      className="onboard-focus"
      aria-label="Cuéntanos qué necesitas"
      aria-hidden={!active}
      {...(!active ? { inert: true } : {})}
    >
      {/* 01 — always in the stack */}
      <div ref={panel1} className="onboard-panel" data-step="1">
        <PanelNav
          onUp={scrollToHero}
          showDown={!!answers.interest}
          onDown={() => scrollToStep(skipsDetailStep(answers) ? 3 : 2)}
        />
        <div className="onboard-panel__inner">
          <PanelMark icon="scan" />
          <h2 className="onboard-panel__question">¿Qué te interesa?</h2>
          {answers.interest ? (
            <AnsweredChip
              label={interestLabel(answers)}
              icon={answers.interestIcon}
              onChange={clearFromInterest}
            />
          ) : (
            <FamilyInterestPicker
              resetKey={stackReset}
              onPick={(leaf: OnboardingLeaf) => {
                if (!active) return;
                setAnswers((prev) => ({
                  ...prev,
                  interest: leaf.interest,
                  interestPickLabel: leaf.label,
                  interestOther: "",
                  interestIcon: leaf.icon,
                  leafId: leaf.id,
                  followUp: leaf.followUp ?? null,
                  followUpOther: "",
                  followUpIcon: leaf.followUp ? leaf.icon : null,
                }));
              }}
              onOtherSubmit={(text) => {
                if (!active) return;
                const trimmed = text.trim();
                setAnswers((prev) => ({
                  ...prev,
                  interest: "other",
                  interestPickLabel: "",
                  interestOther: trimmed,
                  interestIcon: "pen",
                  leafId: "otro",
                  // Skip 02 — they already wrote what they need.
                  followUp: "otro",
                  followUpOther: trimmed,
                  followUpIcon: "pen",
                }));
              }}
            />
          )}
        </div>
      </div>

      {/* 02 — skipped when 01 was free-text “Otro” */}
      <div
        ref={panel2}
        className={`onboard-panel${
          answers.interest && !skipsDetailStep(answers) ? "" : " onboard-panel--locked"
        }`}
        data-step="2"
        aria-hidden={!answers.interest || skipsDetailStep(answers)}
      >
        {answers.interest && !skipsDetailStep(answers) ? (
          <PanelNav
            onUp={() => scrollToStep(1)}
            showDown={!!answers.followUp}
            onDown={() => scrollToStep(3)}
          />
        ) : null}
        <div className="onboard-panel__inner">
          {answers.interest && !skipsDetailStep(answers) ? (
            <>
              <PanelMark icon="list" />
              <h2 className="onboard-panel__question">
                {ONBOARDING_FOLLOWUPS[answers.interest].question}
              </h2>
              {answers.followUp ? (
                <AnsweredChip
                  label={followUpLabel(answers)}
                  icon={answers.followUpIcon}
                  onChange={clearFromFollowUp}
                />
              ) : (
                <CollapsingOptions
                  options={ONBOARDING_FOLLOWUPS[answers.interest].options}
                  otherId="otro"
                  resetKey={`${answers.interest}-${stackReset}`}
                  onPick={(id) => {
                    const opt = ONBOARDING_FOLLOWUPS[answers.interest!].options.find(
                      (o) => o.id === id,
                    );
                    setAnswers((prev) => ({
                      ...prev,
                      followUp: id,
                      followUpOther: "",
                      followUpIcon: opt?.icon ?? null,
                    }));
                  }}
                  onOtherSubmit={(text) => {
                    setAnswers((prev) => ({
                      ...prev,
                      followUp: "otro",
                      followUpOther: text,
                      followUpIcon: "pen",
                    }));
                  }}
                />
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* 03 — contacto; handoff → /proceso (puente + WhatsApp) */}
      <div
        ref={panel3}
        className={`onboard-panel${answers.followUp ? "" : " onboard-panel--locked"}`}
        data-step="3"
        aria-hidden={!answers.followUp}
      >
        {answers.followUp ? (
          <PanelNav onUp={() => scrollToStep(skipsDetailStep(answers) ? 1 : 2)} />
        ) : null}
        <div className="onboard-panel__inner onboard-panel__inner--wide">
          {answers.followUp ? (
            <>
              <PanelMark icon="chat" />
              <h2 className="onboard-panel__question">¿Cómo te contactamos?</h2>
              <div className="onboard-panel__option" style={{ "--reveal-i": 0 } as CSSProperties}>
                <ContactStep
                  name={answers.name}
                  phone={answers.phone}
                  countryIso={answers.countryIso}
                  gender={answers.gender}
                  waOptIn={answers.waOptIn}
                  onNameChange={(name) => setAnswers((prev) => ({ ...prev, name }))}
                  onPhoneChange={(phone, countryIso) =>
                    setAnswers((prev) => ({ ...prev, phone, countryIso }))
                  }
                  onGenderChange={(gender) => setAnswers((prev) => ({ ...prev, gender }))}
                  onWaOptInChange={(waOptIn) => setAnswers((prev) => ({ ...prev, waOptIn }))}
                  onContinue={finishWithWhatsApp}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
