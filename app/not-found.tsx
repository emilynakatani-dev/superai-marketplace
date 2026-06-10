import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <p className="font-mono text-sm text-accent-soft">404</p>
      <h1 className="mt-2 text-2xl font-bold text-white">
        That agent isn&apos;t on the marketplace
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        It may have been unlisted, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl border border-edge-bright bg-panel px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-accent hover:text-white"
      >
        Browse all agents
      </Link>
    </div>
  );
}
