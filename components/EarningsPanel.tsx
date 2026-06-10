"use client";

import { useState } from "react";
import { formatSGD, type CreatorEarnings } from "@/lib/earnings";

interface Payout {
  id: string;
  amount: number;
  method: string;
  arrival: string;
  sandbox: boolean;
}

export default function EarningsPanel({
  slug,
  earnings,
}: {
  slug: string;
  earnings: CreatorEarnings;
}) {
  const [available, setAvailable] = useState(earnings.available);
  const [loading, setLoading] = useState(false);
  const [payout, setPayout] = useState<Payout | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function draw() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Payout failed");
      setPayout({ ...data.payout, sandbox: data.sandbox });
      setAvailable(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-edge bg-panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Creator earnings</h2>
        <span className="rounded-full border border-edge-bright bg-panel-2 px-2 py-0.5 text-[10px] font-medium text-accent-soft">
          Stripe Connect · demo
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-edge bg-night px-3 py-3">
          <p className="text-[11px] text-slate-500">Available</p>
          <p className="mt-1 text-lg font-bold text-white">{formatSGD(available)}</p>
        </div>
        <div className="rounded-xl border border-edge bg-night px-3 py-3">
          <p className="text-[11px] text-slate-500">Pending</p>
          <p className="mt-1 text-lg font-bold text-slate-300">
            {formatSGD(earnings.pending)}
          </p>
        </div>
        <div className="rounded-xl border border-edge bg-night px-3 py-3">
          <p className="text-[11px] text-slate-500">Lifetime</p>
          <p className="mt-1 text-lg font-bold text-slate-300">
            {formatSGD(earnings.lifetime)}
          </p>
        </div>
      </div>

      {payout ? (
        <div className="mt-4 rounded-xl border border-emerald-700/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
          <p className="flex items-center gap-2 font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {formatSGD(payout.amount)} on its way — instant payout {payout.arrival}.
          </p>
          <p className="mt-1 font-mono text-[11px] text-emerald-400/80">
            {payout.id}
            {payout.sandbox ? " · sandbox (enable Connect for live payouts)" : ""}
          </p>
        </div>
      ) : (
        <button
          onClick={draw}
          disabled={loading || available <= 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {loading
            ? "Processing payout…"
            : available > 0
              ? `Draw money now — ${formatSGD(available)}`
              : "Withdrawn"}
        </button>
      )}

      {error && <p role="alert" className="mt-2 text-xs text-red-400">{error}</p>}

      {/* Breakdown */}
      <div className="mt-4 border-t border-edge pt-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Where it comes from
        </p>
        <ul className="mt-2 space-y-1.5">
          {earnings.lines.map((l) => (
            <li
              key={l.agentId + l.role}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-slate-400">
                {l.agentName}{" "}
                <span className="text-slate-600">
                  · {l.role} · {l.model === "subscription" ? "subscription" : "one-time"}
                </span>
              </span>
              <span className="font-mono text-slate-300">{formatSGD(l.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Sales route to creators via Stripe Connect destination charges — one
        processing fee on the sale, no second fee to pay out. &ldquo;Draw money
        now&rdquo; is an instant payout (optional ~1.5% fee); standard payouts
        are free.
      </p>
    </div>
  );
}
