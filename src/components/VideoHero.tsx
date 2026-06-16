"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 12a4.5 4.5 0 0 0-2.1-3.8l1.4-1.4a6.5 6.5 0 0 1 0 10.4l-1.4-1.4A4.5 4.5 0 0 0 16.5 12zM12 4 7 9H4v6h3l5 5V4zm-.5 12.5V7.5l3.8 3.8-3.8 3.8z" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4 7 9H4v6h3l5 5V4zm-1.5 12.5V7.5l3.8 3.8-3.8 3.8zm2.9-2.9 1.4 1.4a6.5 6.5 0 0 0 0-10.4l-1.4 1.4a4.5 4.5 0 0 1 0 7.6z" />
    </svg>
  );
}

export function VideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    if (inView) {
      if (!userPausedRef.current) {
        video.muted = true;
        setIsMuted(true);
        void video.play().then(
          () => setIsPlaying(true),
          () => setIsPlaying(false),
        );
      }
    } else {
      video.pause();
      video.currentTime = 0;
      userPausedRef.current = false;
      setIsPlaying(false);
    }
  }, [inView, reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      void video.play();
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      void video.play();
    }
  }, []);

  if (reduceMotion) {
    return (
      <div
        ref={containerRef}
        className="video-showcase flex items-center justify-center p-8"
        aria-hidden="true"
      >
        <p className="text-center text-slate-400">Sitios, formularios y paneles para negocio</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="video-showcase relative">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/hero-poster.svg"
        className="h-full w-full object-cover"
      >
        <source src="/video/hero-demo.webm" type="video/webm" />
        <source src="/video/hero-demo.mp4" type="video/mp4" />
      </video>

      <div className="video-controls">
        <button
          type="button"
          onClick={togglePlay}
          className="video-control-btn"
          aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="video-control-btn"
          aria-label={isMuted ? "Activar audio" : "Silenciar video"}
        >
          {isMuted ? <MuteIcon /> : <SoundIcon />}
        </button>
      </div>
    </div>
  );
}
