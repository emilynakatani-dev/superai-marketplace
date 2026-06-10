"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  agentId: string;
  agentName: string;
  tagline: string;
  avatar: string;
  /** Already FX-converted into the display currency. */
  amount: number;
  /** Currency symbol matching `amount`, e.g. "S$". */
  symbol: string;
  isSubscription: boolean;
}

export default function DemoCheckout({
  agentId,
  agentName,
  tagline,
  avatar,
  amount,
  symbol,
  isSubscription,
}: Props) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);

  // Simulate Stripe processing latency, then bounce back like a real
  // success_url. The timer lives in an effect so unmounting (cancel link,
  // browser back) clears it instead of completing a cancelled purchase.
  useEffect(() => {
    if (!paying) return;
    const timer = setTimeout(() => {
      router.push(`/agents/${agentId}?purchase=success&demo_session=1`);
    }, 1400);
    return () => clearTimeout(timer);
  }, [paying, agentId, router]);

  function pay() {
    setPaying(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="sr-only">Checkout</h1>
      <div className="mb-4 rounded-lg border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-300">
        Demo mode — no Stripe keys configured. This simulates Stripe Checkout in
        test mode; no real request is made.
      </div>

      <div className="overflow-hidden rounded-2xl border border-edge bg-panel">
        <div className="border-b border-edge bg-panel-2 px-5 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt={`${agentName} avatar`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {agentName} — expert agent
              </p>
              <p className="text-xs text-slate-500">{tagline}</p>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white">
            {symbol}
            {amount}
            <span className="ml-1 text-sm font-normal text-slate-400">
              {isSubscription ? "per month" : "one-time"}
            </span>
          </p>
        </div>

        <div className="space-y-3 px-5 py-5">
          <label className="block">
            <span className="text-xs text-slate-500">Card number</span>
            <input
              readOnly
              value="4242 4242 4242 4242"
              className="mt-1 w-full rounded-lg border border-edge bg-night px-3 py-2 font-mono text-sm text-slate-300"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">Expiry</span>
              <input
                readOnly
                value="12 / 34"
                className="mt-1 w-full rounded-lg border border-edge bg-night px-3 py-2 font-mono text-sm text-slate-300"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">CVC</span>
              <input
                readOnly
                value="123"
                className="mt-1 w-full rounded-lg border border-edge bg-night px-3 py-2 font-mono text-sm text-slate-300"
              />
            </label>
          </div>

          <button
            onClick={pay}
            disabled={paying}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-accent to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {paying
              ? "Processing…"
              : isSubscription
                ? `Subscribe ${symbol}${amount}/mo`
                : `Pay ${symbol}${amount}`}
          </button>

          <Link
            href={`/agents/${agentId}?purchase=cancelled`}
            aria-disabled={paying}
            tabIndex={paying ? -1 : undefined}
            className={`block text-center text-xs transition-colors ${
              paying
                ? "pointer-events-none text-slate-700"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Cancel and return
          </Link>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Add STRIPE_SECRET_KEY to switch this flow to real Stripe Checkout (test
        mode).
      </p>
    </div>
  );
}
