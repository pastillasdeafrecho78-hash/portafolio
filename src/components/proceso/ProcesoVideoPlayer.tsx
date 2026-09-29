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

/** Ring fill before the check → play handoff. */
const CUE_MS = 1400;
const PLAY_HANDOFF_MS = 380;

type GatePhase = "loading" | "check" | "play";

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
 * Clip for /proceso. Stays paused under a cue overlay (ring → check → play).
 * Playback starts only on the play tap; native controls appear after that.
 * Desktop (≥768px) uses the landscape `-pc` cut.
 */
export function ProcesoVideoPlayer({ videoId, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasSource, setHasSource] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [gate, setGate] = useState<GatePhase>("loading");
  const variant = useProcesoVideoVariant();
  const src = procesoVideoSrc(videoId, variant);
  const label = PROCESO_VIDEO_LABELS[videoId];
  const canPlay = gate === "play";

  useEffect(() => {
    setHasSource(true);
    setPlaying(false);
    setGate("loading");
    const el = videoRef.current;
    if (!el) return;
    delete el.dataset.fallbackTried;
    el.pause();
    el.currentTime = 0;
    el.muted = true;
    el.load();
  }, [videoId, variant]);

  useEffect(() => {
    if (playing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setGate("play");
      return;
    }

    const toCheck = window.setTimeout(() => setGate("check"), CUE_MS);
    const toPlay = window.setTimeout(
      () => setGate("play"),
      CUE_MS + PLAY_HANDOFF_MS,
    );
    return () => {
      window.clearTimeout(toCheck);
      window.clearTimeout(toPlay);
    };
  }, [playing, videoId, variant]);

  async function startPlayback() {
    const el = videoRef.current;
    if (!el || playing || !canPlay) return;
    el.muted = false;
    try {
      await el.play();
    } catch {
      el.muted = true;
      await el.play().catch(() => undefined);
    }
    setPlaying(true);
  }

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
            muted
            loop
            playsInline
            controls={playing}
            controlsList="nodownload"
            preload="metadata"
            aria-label={`Video: ${label}`}
            onPlay={() => setPlaying(true)}
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

          {!playing ? (
            <div className="proceso-video__gate" aria-busy={!canPlay}>
              <button
                type="button"
                className={`proceso-cue is-${gate}${canPlay ? " proceso-cue--play" : ""}`}
                onClick={() => void startPlayback()}
                disabled={!canPlay}
                aria-label={
                  canPlay
                    ? `Reproducir video: ${label}`
                    : "Preparando video"
                }
              >
                <svg
                  className="proceso-cue__svg"
                  viewBox="0 0 120 120"
                  fill="none"
                  aria-hidden
                >
                  <circle className="proceso-cue__track" cx="60" cy="60" r="52" />
                  <circle className="proceso-cue__progress" cx="60" cy="60" r="52" />
                  <path
                    className="proceso-cue__check"
                    d="M38 62.5 L52.5 77 L84 44"
                    pathLength={1}
                  />
                  <path
                    className="proceso-cue__play"
                    d="M48 38 L48 82 L86 60 Z"
                  />
                </svg>
              </button>
            </div>
          ) : null}
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
