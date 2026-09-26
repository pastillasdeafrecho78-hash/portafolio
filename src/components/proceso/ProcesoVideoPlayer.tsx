"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROCESO_VIDEO_LABELS,
  procesoVideoSrc,
  type ProcesoVideoId,
  type ProcesoVideoVariant,
} from "@/lib/procesoVideos";

type Props = {
  videoId: ProcesoVideoId;
  className?: string;
};

function useProcesoVideoVariant(): ProcesoVideoVariant {
  const [variant, setVariant] = useState<ProcesoVideoVariant>("mobile");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setVariant(mq.matches ? "desktop" : "mobile");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return variant;
}

/**
 * Looping clip for /proceso. Autoplay starts muted (browser policy).
 * A visible control lets the visitor turn sound on or off.
 * Desktop (≥768px) uses the landscape `-pc` cut.
 */
export function ProcesoVideoPlayer({ videoId, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasSource, setHasSource] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const variant = useProcesoVideoVariant();
  const src = procesoVideoSrc(videoId, variant);
  const label = PROCESO_VIDEO_LABELS[videoId];

  useEffect(() => {
    setHasSource(true);
    const el = videoRef.current;
    if (!el) return;
    delete el.dataset.fallbackTried;
    el.muted = !soundOn;
    el.load();
    void el.play().catch(() => {
      el.muted = true;
      setSoundOn(false);
      void el.play().catch(() => undefined);
    });
    // soundOn is applied in the effect below; reloading here would restart the clip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, variant]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !soundOn;
    if (soundOn) {
      void el.play().catch(() => undefined);
    }
  }, [soundOn]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    const el = videoRef.current;
    if (!el) return;
    el.muted = !next;
    if (next) {
      void el.play().catch(() => undefined);
    }
  };

  return (
    <div
      className={`proceso-video proceso-video--${variant} ${className}`.trim()}
    >
      {hasSource ? (
        <>
          <video
            ref={videoRef}
            className="proceso-video__media"
            poster={src.poster}
            muted={!soundOn}
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={`Video: ${label}`}
            onError={() => {
              const el = videoRef.current;
              if (
                el &&
                variant === "desktop" &&
                "fallbackMp4" in src &&
                src.fallbackMp4 &&
                src.fallbackPoster &&
                !el.dataset.fallbackTried
              ) {
                el.dataset.fallbackTried = "1";
                const source = el.querySelector("source");
                if (source) {
                  source.src = src.fallbackMp4;
                  el.poster = src.fallbackPoster;
                  el.load();
                  return;
                }
              }
              setHasSource(false);
            }}
          >
            <source src={src.mp4} type="video/mp4" />
          </video>
          <button
            type="button"
            className="proceso-video__sound"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Silenciar audio" : "Activar audio"}
          >
            <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
            <span>{soundOn ? "Sonido" : "Activar sonido"}</span>
          </button>
        </>
      ) : (
        <div className="proceso-video__fallback" role="img" aria-label={label}>
          <span className="proceso-video__fallback-kicker">Video no disponible</span>
          <span className="proceso-video__fallback-title">{label}</span>
          <span className="proceso-video__fallback-hint">
            Intenta recargar la página.
          </span>
        </div>
      )}
    </div>
  );
}
