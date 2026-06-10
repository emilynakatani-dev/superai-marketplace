"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, Ref } from "react";

/** Attributes of the <model-viewer> web component (registered client-side
 *  via the dynamic import below — keep this in sync with usage). */
type ModelViewerAttributes = {
  src: string;
  poster?: string;
  alt?: string;
  autoplay?: boolean;
  loading?: "auto" | "lazy" | "eager";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: number;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string;
  "interaction-prompt"?: string;
  "touch-action"?: string;
  exposure?: string;
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  className?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

export type AvatarViewerStatus = "loading" | "ready" | "unsupported" | "error";

type ModelViewerEl = HTMLElement & {
  autoRotate?: boolean;
  play?: () => void;
  pause?: () => void;
};

// Probe once per page lifetime and release the context immediately —
// per-mount probes accumulate live WebGL contexts until GC.
let webglSupport: boolean | null = null;
function hasWebGL(): boolean {
  if (webglSupport === null) {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webglSupport;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Interactive 3D avatar viewer. Renders the rigged GLB with auto-rotate and
 *  the idle animation; falls back to the poster when there is no model yet,
 *  WebGL is unavailable, or the model fails to load. Motion is off for
 *  prefers-reduced-motion users and can be paused by anyone. */
export default function AvatarViewer({
  src,
  poster,
  alt,
  onStatusChange,
}: {
  src?: string;
  poster: string;
  alt: string;
  onStatusChange?: (status: AvatarViewerStatus) => void;
}) {
  const viewerRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<AvatarViewerStatus>("loading");
  const [motionOn, setMotionOn] = useState(() => !prefersReducedMotion());

  // Register the web component (heavy, client-only) — gated on WebGL.
  useEffect(() => {
    if (!src) return;
    if (!hasWebGL()) {
      setStatus("unsupported");
      return;
    }
    let cancelled = false;
    import("@google/model-viewer").catch(() => {
      if (!cancelled) setStatus("error");
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!src || !el || status === "unsupported" || status === "error") return;
    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("error");
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    // A cached model can finish before this effect runs — don't miss it.
    if ((el as ModelViewerEl & { loaded?: boolean }).loaded) setStatus("ready");
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
    };
  }, [src, status]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Drive rotation + idle clip from the motion toggle once the model is up.
  useEffect(() => {
    const el = viewerRef.current as ModelViewerEl | null;
    if (!el || status !== "ready") return;
    el.autoRotate = motionOn;
    if (motionOn) el.play?.();
    else el.pause?.();
  }, [motionOn, status]);

  if (!src) {
    return <PosterCard poster={poster} alt={alt} />;
  }
  if (status === "unsupported") {
    return (
      <PosterCard
        poster={poster}
        alt={alt}
        note="Interactive 3D needs WebGL — showing a still."
      />
    );
  }
  if (status === "error") {
    return (
      <PosterCard
        poster={poster}
        alt={alt}
        note="Couldn't load the 3D model — showing a still."
      />
    );
  }

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-xl border border-edge bg-night/60">
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        poster={poster}
        autoplay={motionOn}
        // The viewer only mounts once its tab is opened, so load immediately —
        // the default visibility-based lazy load can stall in headless contexts.
        loading="eager"
        camera-controls
        auto-rotate={motionOn}
        auto-rotate-delay={0}
        rotation-per-second="25deg"
        shadow-intensity="1"
        exposure="1.05"
        interaction-prompt="none"
        touch-action="pan-y"
        style={
          {
            width: "100%",
            height: "100%",
            "--progress-bar-color": "var(--color-accent, #60a5fa)",
          } as CSSProperties
        }
      />
      {status === "loading" && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/70"
        >
          <Image
            src={poster}
            alt=""
            width={160}
            height={240}
            unoptimized
            className="h-48 w-auto rounded-lg opacity-60"
          />
          <span className="flex items-center gap-2 text-xs text-slate-400">
            <span
              className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent"
              aria-hidden="true"
            />
            Loading 3D model…
          </span>
        </div>
      )}
      {status === "ready" && (
        <button
          onClick={() => setMotionOn((m) => !m)}
          aria-pressed={!motionOn}
          className="absolute right-3 bottom-3 rounded-lg border border-edge-bright bg-night/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-colors hover:border-accent hover:text-white"
        >
          {motionOn ? "Pause motion" : "Play motion"}
        </button>
      )}
    </div>
  );
}

function PosterCard({
  poster,
  alt,
  note,
}: {
  poster: string;
  alt: string;
  note?: string;
}) {
  return (
    <div className="relative flex h-[480px] w-full items-center justify-center overflow-hidden rounded-xl border border-edge bg-night/60">
      <Image
        src={poster}
        alt={alt}
        width={320}
        height={480}
        className="h-full w-auto object-contain py-4"
      />
      {note && (
        <p className="absolute bottom-3 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-lg bg-night/85 px-3 py-1 text-center text-xs text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
}
