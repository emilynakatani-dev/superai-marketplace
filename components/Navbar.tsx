import Link from "next/link";
import { Logo } from "@/components/Logo";

const LIONCLAW_DASHBOARD = "https://dashboard20-theta.vercel.app/overview";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Project Mural home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-400">
          <Link href="/#agents" className="transition-colors hover:text-white">
            Agents
          </Link>
          <a
            href={LIONCLAW_DASHBOARD}
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
