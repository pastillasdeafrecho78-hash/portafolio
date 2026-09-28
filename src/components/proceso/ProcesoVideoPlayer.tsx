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
 * Clip for /proceso with native controls (play/pause, scrubber, fullscreen, mute).
 * Autoplay starts muted (browser policy); the visitor unmutes from the control bar.
 * Desktop (≥768px) uses the landscape `-pc` cut.
 */
export function ProcesoVideoPlayer({ videoId, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasSource, setHasSource] = useState(true);
  const variant = useProcesoVideoVariant();
  const src = procesoVideoSrc(videoId, variant);
  const label = PROCESO_VIDEO_LABELS[videoId];

  useEffect(() => {
    setHasSource(true);
    const el = videoRef.current;
    if (!el) return;
    delete el.dataset.fallbackTried;
    el.muted = true;
    el.load();
    void el.play().catch(() => undefined);
  }, [videoId, variant]);

  return (
    <div
      className={`proceso-video proceso-video--${variant} ${className}`.trim()}
    >
      {hasSource ? (
        <video
          ref={videoRef}
          className="proceso-video__media"
          poster={src.poster}
          muted
          loop
          playsInline
          autoPlay
          controls
          controlsList="nodownload"
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
