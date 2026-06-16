"use client";

import { useCallback, useRef, useState } from "react";

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

export function BondingVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (video.paused) startPlayback();
    else video.pause();
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

  const startSeek = useCallback(() => {
    seekingRef.current = true;
  }, []);

  const endSeek = useCallback(() => {
    seekingRef.current = false;
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  }, []);

  const maxTime = duration > 0 ? duration : 0.01;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="bonding-video-stage relative" tabIndex={0}>
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        poster="/bonding/poster.svg"
        className="bonding-video-el"
        disablePictureInPicture
        disableRemotePlayback
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (!seekingRef.current && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onDurationChange={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
      >
        <source src="/bonding/demo.mp4" type="video/mp4" />
      </video>

      {!isPlaying && (
        <button
          type="button"
          onClick={startPlayback}
          className="video-play-prompt"
          aria-label="Reproducir demo con audio"
        >
          <span className="video-play-prompt-icon" aria-hidden="true">
            <PlayIcon />
          </span>
          <span className="video-play-prompt-text">Reproducir demo</span>
        </button>
      )}

      <div className="video-controls">
        <div className="video-controls-bar">
          <button
            type="button"
            onClick={togglePlay}
            className="video-control-btn"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="video-seek-wrap">
            <input
              type="range"
              min={0}
              max={maxTime}
              step={0.05}
              value={Math.min(currentTime, maxTime)}
              onInput={(e) => handleSeek(Number(e.currentTarget.value))}
              onChange={(e) => handleSeek(Number(e.currentTarget.value))}
              onPointerDown={startSeek}
              onPointerUp={endSeek}
              onPointerCancel={endSeek}
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
            aria-label={isMuted ? "Activar audio" : "Silenciar"}
          >
            {isMuted ? <MuteIcon /> : <SoundIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
