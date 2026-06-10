import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getCreatorEarnings } from "@/lib/earnings";
import { getPerson } from "@/lib/people";

/**
 * "Draw money now" — an instant payout of a creator's available balance.
 *
 * Real flow (once Stripe Connect is enabled and the creator is onboarded as a
 * connected account): the sale is a destination charge, so the money already
 * sits in the creator's Stripe balance net of a single processing fee. This
 * route then issues an INSTANT payout from that balance to their debit card:
 *
 *   await stripe.payouts.create(
 *     { amount, currency, method: "instant" },
 *     { stripeAccount: connectedAccountId },
 *   );
 *
 * No second card fee is charged — only the optional instant-payout fee (~1.5%).
 * Set STRIPE_CONNECT_ACCOUNT (the creator's acct_...) to run it for real;
 * otherwise we return a sandbox payout so the flow is fully demoable.
 */
export async function POST(request: NextRequest) {
  let slug: unknown;
  try {
    ({ slug } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const person = typeof slug === "string" ? getPerson(slug) : undefined;
  const earnings = typeof slug === "string" ? getCreatorEarnings(slug) : null;
  if (!person || !earnings) {
    return NextResponse.json({ error: "Unknown creator" }, { status: 400 });
  }
  if (earnings.available <= 0) {
    return NextResponse.json({ error: "Nothing available to withdraw" }, { status: 400 });
  }

  const amountMinor = earnings.available * 100;
  const connectAccount = process.env.STRIPE_CONNECT_ACCOUNT;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Real instant payout — only when Connect is enabled and an account is set.
  if (secretKey && connectAccount) {
    try {
      const stripe = new Stripe(secretKey);
      const payout = await stripe.payouts.create(
        { amount: amountMinor, currency: earnings.currency, method: "instant" },
        { stripeAccount: connectAccount },
      );
      return NextResponse.json({
        ok: true,
        sandbox: false,
        payout: {
          id: payout.id,
          amount: earnings.available,
          currency: earnings.currency,
          method: "instant",
          arrival: "in minutes",
        },
      });
    } catch (error) {
      console.error("Instant payout failed:", error);
      return NextResponse.json(
        { error: "Payout failed — check the connected account's payout settings." },
        { status: 502 },
      );
    }
  }

  // Sandbox: Stripe Connect not yet enabled on this account.
  const token = randomBytes(6).toString("hex");
  return NextResponse.json({
    ok: true,
    sandbox: true,
    payout: {
      id: `po_demo_${token}`,
      amount: earnings.available,
      currency: earnings.currency,
      method: "instant",
      arrival: "in minutes",
    },
  });
}
