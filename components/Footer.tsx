export default function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>
          CloneMarket — built at SuperAI 2026. Payments run in Stripe test mode.
        </p>
        <p className="font-mono text-xs">
          exports: lionclaw · openclaw · hermes
        </p>
      </div>
    </footer>
  );
}
