"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POSTER = "/agent-office-simulation-poster.webp";
const ALT =
  "The Lionclaw virtual office, with all five Project Mural agents at the coffee bar";

/** Looping office-view clip. The video only mounts on the client for users
 *  without prefers-reduced-motion — everyone else gets the still, and the
 *  mp4 is never downloaded. A toggle lets anyone pause the loop. */
export default function OfficeView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setShowVideo(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="relative">
        {showVideo ? (
          <video
            ref={videoRef}
            className="w-full"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER}
            aria-label={ALT}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            // If autoplay is blocked there's no pause event — sync the label.
            onLoadedData={(e) => setPlaying(!e.currentTarget.paused)}
          >
            <source src="/agent-office-simulation.mp4" type="video/mp4" />
          </video>
        ) : (
          // Same URL as the video poster, so the browser cache is shared.
          <Image
            src={POSTER}
            alt={ALT}
            width={1440}
            height={854}
            unoptimized
            className="w-full"
          />
        )}
        {showVideo && (
          <button
            onClick={toggle}
            aria-pressed={!playing}
            className="absolute right-3 bottom-3 rounded-lg border border-edge-bright bg-night/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-colors hover:border-accent hover:text-white"
          >
            {playing ? "Pause" : "Play"}
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-edge bg-night/60 px-4 py-2.5 text-xs text-slate-400">
        <span>
          emily · eugene · carlos · marcus · scarlett — live in the{" "}
          <span className="font-mono text-accent-soft">Lionclaw</span> office
        </span>
        <a
          href="https://dashboard20-theta.vercel.app/overview"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 transition-colors hover:text-accent-soft"
        >
          Open Lionclaw ↗
        </a>
      </figcaption>
    </figure>
  );
}
