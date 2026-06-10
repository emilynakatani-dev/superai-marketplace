import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>
          Project Mural — built at SuperAI 2026. Payments run in Stripe test
          mode.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/exa"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-glow"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L3 14h7l-1 8 11-13h-7z" />
            </svg>
            Powered by Exa
          </Link>
          <p className="font-mono text-xs">exports: lionclaw · openclaw · hermes</p>
        </div>
      </div>
    </footer>
  );
}
