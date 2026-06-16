"use client";

import { useEffect, useRef, useState } from "react";

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function enableAudio() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    void video.play().then(() => setNeedsUnmute(false));
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    video.muted = true;
    video.play().catch(() => {});

    const tryWithSound = async () => {
      video.muted = false;
      try {
        await video.play();
        setNeedsUnmute(false);
      } catch {
        video.muted = true;
        video.play().catch(() => {});
        setNeedsUnmute(true);
      }
    };

    void tryWithSound();
  }, [reduceMotion]);

  useEffect(() => {
    if (!needsUnmute || reduceMotion) return;

    const onFirstInteraction = () => enableAudio();
    document.addEventListener("click", onFirstInteraction, { once: true });
    document.addEventListener("touchstart", onFirstInteraction, { once: true });
    return () => {
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [needsUnmute, reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="video-showcase flex items-center justify-center p-8" aria-hidden="true">
        <p className="text-center text-slate-400">Demo de sitios, formularios y paneles</p>
      </div>
    );
  }

  return (
    <div className="video-showcase relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.svg"
        className="h-full w-full object-cover"
      >
        <source src="/video/hero-demo.webm" type="video/webm" />
        <source src="/video/hero-demo.mp4" type="video/mp4" />
      </video>

      {needsUnmute && (
        <button
          type="button"
          onClick={enableAudio}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/85"
          aria-label="Activar audio del video"
        >
          <span aria-hidden="true">🔊</span>
          Activar audio
        </button>
      )}
    </div>
  );
}
