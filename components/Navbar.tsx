import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-glow text-sm font-bold text-night">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="2.6" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Clone<span className="text-accent-soft">Market</span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-400">
          <Link href="/#agents" className="transition-colors hover:text-white">
            Agents
          </Link>
          <a
            href="https://github.com/cchacons/superai-lionclaw"
            target="_blank"
            rel="noreferrer"
            className="hidden transition-colors hover:text-white sm:block"
          >
            Lionclaw
          </a>
          <span className="rounded-full border border-edge-bright bg-panel-2 px-2.5 py-1 text-xs font-medium text-accent-soft">
            Stripe test mode
          </span>
        </nav>
      </div>
    </header>
  );
}
