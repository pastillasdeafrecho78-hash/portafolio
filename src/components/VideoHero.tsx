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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekingRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inView, setInView] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (!video || reduceMotion || inView) return;

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    setIsPlaying(false);
    setIsMuted(false);
    setCurrentTime(0);
  }, [inView, reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (!seekingRef.current) setCurrentTime(video.currentTime);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onDurationChange = () => setDuration(video.duration);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onDurationChange);

    if (video.readyState >= 1) setDuration(video.duration);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onDurationChange);
    };
  }, []);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    setIsMuted(false);

    void video.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false),
    );
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
    }
  }, [startPlayback]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleSeek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.currentTime = value;
    setCurrentTime(value);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showPlayPrompt = inView && !isPlaying;

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
    <div ref={containerRef} className="video-showcase relative" tabIndex={0}>
      <video
        ref={videoRef}
        loop
        playsInline
        preload="metadata"
        poster="/video/hero-poster.svg"
        className="h-full w-full object-cover"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/video/hero-demo.webm" type="video/webm" />
        <source src="/video/hero-demo.mp4" type="video/mp4" />
      </video>

      {showPlayPrompt && (
        <button
          type="button"
          onClick={startPlayback}
          className="video-play-prompt"
          aria-label="Reproducir presentación con audio"
        >
          <span className="video-play-prompt-icon" aria-hidden="true">
            <PlayIcon />
          </span>
          <span className="video-play-prompt-text">Reproducir presentación</span>
        </button>
      )}

      <div className="video-controls">
        <div className="video-controls-bar">
          <button
            type="button"
            onClick={togglePlay}
            className="video-control-btn"
            aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className="video-seek-wrap">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              onMouseDown={() => {
                seekingRef.current = true;
              }}
              onMouseUp={() => {
                seekingRef.current = false;
              }}
              onTouchStart={() => {
                seekingRef.current = true;
              }}
              onTouchEnd={() => {
                seekingRef.current = false;
              }}
              className="video-seek"
              aria-label="Posición del video"
              style={{ "--video-progress": `${progress}%` } as React.CSSProperties}
            />
          </div>

          <span className="video-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

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
    </div>
  );
}
