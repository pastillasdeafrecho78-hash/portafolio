"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { STORAGE_ONBOARDING } from "@/lib/constants";

const DONE_KEY = `${STORAGE_ONBOARDING}-done`;
const LEGACY_INTRO = `${STORAGE_ONBOARDING}-intro`;

/**
 * Root = Ofertas: brand intro + questionnaire.
 * Última pantalla (puente WhatsApp + espera) vive en /proceso.
 */
export function HomeExperience() {
  const router = useRouter();
  const [introSettled, setIntroSettled] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem(LEGACY_INTRO);
      sessionStorage.removeItem(STORAGE_ONBOARDING);
      sessionStorage.removeItem(DONE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Header visible en todo el hero; se oculta al entrar a las preguntas
  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const panel = document.querySelector<HTMLElement>(
        '.onboard-panel[data-step="1"]',
      );
      if (!panel) {
        root.classList.remove("is-header-away");
        return;
      }
      const panelTop = panel.getBoundingClientRect().top + window.scrollY;
      // Mientras el hero sigue siendo el foco (Q1 aún no ocupa la vista)
      const hideFrom = panelTop - window.innerHeight * 0.45;
      if (window.scrollY < hideFrom) {
        root.classList.remove("is-header-away");
      } else {
        root.classList.add("is-header-away");
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      root.classList.remove("is-header-away");
    };
  }, []);

  const onSettled = useCallback(() => setIntroSettled(true), []);

  const onComplete = useCallback(() => {
    router.push("/proceso");
  }, [router]);

  return (
    <>
      <Header />
      <main id="main">
        <Hero onSettled={onSettled} />
        <OnboardingFlow active={introSettled} onComplete={onComplete} />
      </main>
    </>
  );
}
