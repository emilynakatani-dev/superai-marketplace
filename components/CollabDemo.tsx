"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POSTER = "/agent-collab-demo-poster.webp";
const ALT =
  "Eugene the frog agent running over to Carlos to work together in the Lionclaw office";

/** Square close-up clip: Eugene spots Carlos working and runs over to pair
 *  up. Client-mounted so reduced-motion users get the still and never
 *  download the mp4; anyone can pause. */
export default function CollabDemo() {
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
            onLoadedData={(e) => setPlaying(!e.currentTarget.paused)}
          >
            <source src="/agent-collab-demo.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src={POSTER}
            alt={ALT}
            width={720}
            height={720}
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
      <figcaption className="border-t border-edge bg-night/60 px-4 py-2.5 text-xs leading-relaxed text-slate-400">
        <span aria-hidden="true">🐸</span> Eugene spots Carlos deep in work —
        and runs over to pair up. Sped up 2×, captured live.
      </figcaption>
    </figure>
  );
}
