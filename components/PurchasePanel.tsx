"use client";

import { useEffect, useState } from "react";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  convertFromUsd,
  getCurrency,
} from "@/lib/currencies";

interface Props {
  agentId: string;
  agentName: string;
  pricingModel: "one_time" | "subscription";
  amount: number;
  justPurchased: boolean;
  cancelled: boolean;
}

const HARNESSES = [
  { id: "lionclaw", label: "Lionclaw", file: "agent.json5" },
  { id: "openclaw", label: "OpenClaw", file: "openclaw.json" },
  { id: "hermes", label: "Hermes", file: "hermes.yaml" },
];

export default function PurchasePanel({
  agentId,
  agentName,
  pricingModel,
  amount,
  justPurchased,
  cancelled,
}: Props) {
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);

  const currency = getCurrency(currencyCode);
  // Listing prices are USD; show (and charge) the FX-converted local amount.
  const localAmount = convertFromUsd(amount, currencyCode);
  const storageKey = `project-mural:owned:${agentId}`;

  useEffect(() => {
    if (justPurchased) {
      localStorage.setItem(storageKey, "1");
    }
    // localStorage only exists on the client, so the SSR markup must render
    // un-owned and the real state is applied in a second pass after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOwned(localStorage.getItem(storageKey) === "1");
  }, [storageKey, justPurchased]);

  // Returning via the browser's back/forward cache restores React state
  // as-is, which would leave the button stuck on "Redirecting…".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
        setError(null);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, currency: currencyCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  const isSub = pricingModel === "subscription";

  return (
    <div className="rounded-2xl border border-edge bg-panel p-5">
      {justPurchased && (
        <div className="mb-4 rounded-lg border border-emerald-700/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
          Payment successful — {agentName} is yours. Export below.
        </div>
      )}
      {cancelled && (
        <div className="mb-4 rounded-lg border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
          Checkout cancelled — no charge was made.
        </div>
      )}

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-white">
          {currency.symbol}
          {localAmount}
        </span>
        <span className="text-sm text-slate-400">
          {isSub ? "/ month" : "one-time"}
        </span>
        {currencyCode !== "usd" && (
          <span className="text-xs text-slate-500">≈ ${amount} USD</span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {isSub
          ? "Recurring subscription — unlimited runs while active."
          : "Single payment — yours forever, unlimited runs."}
      </p>

      {!owned && (
        <div className="mt-4">
          <label className="flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>Pay in</span>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              disabled={loading}
              aria-label="Payment currency"
              className="rounded-lg border border-edge-bright bg-night px-2 py-1.5 text-xs text-slate-200 outline-none focus-visible:border-accent disabled:opacity-60"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            International cards accepted in every currency.
            {!isSub && currency.localMethod
              ? ` ${currency.flag} ${currency.label} also offers ${currency.localMethod} at checkout.`
              : isSub
                ? " Subscriptions are billed by card."
                : ""}
          </p>
        </div>
      )}

      {owned ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-700/60 bg-emerald-950/30 px-4 py-3 text-sm font-medium text-emerald-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isSub ? "Subscription active" : "Owned"}
        </div>
      ) : (
        <button
          onClick={buy}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Redirecting to checkout…"
            : isSub
              ? `Subscribe — ${currency.symbol}${localAmount}/mo`
              : `Buy ${agentName} — ${currency.symbol}${localAmount}`}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}

      {!owned && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Stripe test mode — use card{" "}
          <span className="font-mono text-slate-300 select-all">
            4242 4242 4242 4242
          </span>
        </p>
      )}

      <div className="mt-5 border-t border-edge pt-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          Export to harness
          {!owned && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="5"
                y="11"
                width="14"
                height="9"
                rx="2"
                stroke="#64748b"
                strokeWidth="2"
              />
              <path
                d="M8 11V7a4 4 0 118 0v4"
                stroke="#64748b"
                strokeWidth="2"
              />
            </svg>
          )}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {owned
            ? "Download the agent config and run it on your own stack."
            : "Purchase to unlock the portable agent config."}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {HARNESSES.map((h) =>
            owned ? (
              <a
                key={h.id}
                href={`/api/export/${agentId}?format=${h.id}`}
                download
                className="group rounded-lg border border-edge-bright bg-panel-2 px-2 py-2 text-center transition-colors hover:border-accent"
              >
                <span className="block text-xs font-semibold text-slate-200 transition-colors group-hover:text-white">
                  {h.label}
                </span>
                <span className="block font-mono text-[10px] text-slate-500 transition-colors group-hover:text-slate-300">
                  {h.file}
                </span>
              </a>
            ) : (
              <span
                key={h.id}
                className="cursor-not-allowed rounded-lg border border-edge bg-night px-2 py-2 text-center"
              >
                <span className="block text-xs font-semibold text-slate-400">
                  {h.label}
                </span>
                <span className="block font-mono text-[10px] text-slate-600">
                  {h.file}
                </span>
              </span>
            ),
          )}
        </div>
        {owned && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
            <svg
              className="mt-0.5 shrink-0 text-slate-500"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="2" />
            </svg>
            Each download is watermarked and licensed to you — single-seat,
            no redistribution. Agents run hosted by default.
          </p>
        )}
      </div>
    </div>
  );
}
