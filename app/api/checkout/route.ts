import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getAgent } from "@/lib/agents";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "@/lib/currencies";

export async function POST(request: NextRequest) {
  let agentId: unknown;
  let currencyInput: unknown;
  try {
    ({ agentId, currency: currencyInput } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const agent = typeof agentId === "string" ? getAgent(agentId) : undefined;
  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 400 });
  }

  // Currency drives which local payment methods Stripe surfaces. Validate
  // against the allowlist; fall back to the default.
  const currency =
    typeof currencyInput === "string" &&
    CURRENCY_CODES.includes(currencyInput.toLowerCase())
      ? currencyInput.toLowerCase()
      : DEFAULT_CURRENCY;

  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Demo mode: no Stripe keys configured — use the built-in mock checkout.
  if (!secretKey) {
    return NextResponse.json({
      url: `/checkout/demo?agent=${agent.id}`,
      demo: true,
    });
  }

  // Only platform-controlled sources — this value ends up in Stripe
  // redirect URLs, so the client-supplied Origin header must not be used.
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const isSubscription = agent.pricing.model === "subscription";

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: agent.pricing.amount * 100,
            product_data: {
              name: `${agent.name} — expert agent`,
              description: agent.tagline,
              // Stripe can only fetch publicly reachable images.
              ...(origin.startsWith("https://")
                ? { images: [`${origin}${agent.avatar}`] }
                : {}),
            },
            ...(isSubscription
              ? { recurring: { interval: agent.pricing.interval ?? "month" } }
              : {}),
          },
        },
      ],
      success_url: `${origin}/agents/${agent.id}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/agents/${agent.id}?purchase=cancelled`,
      // Collect a billing country so the customer can change it and see the
      // payment methods refine. Payment methods themselves are dynamic
      // (no payment_method_types set) — Stripe shows what's eligible for the
      // currency + account, e.g. PayNow for SGD one-time payments.
      billing_address_collection: "required",
      metadata: { agentId: agent.id, currency },
      // Session metadata doesn't propagate to the underlying objects on
      // its own; webhooks need it on the subscription / payment intent.
      ...(isSubscription
        ? { subscription_data: { metadata: { agentId: agent.id } } }
        : { payment_intent_data: { metadata: { agentId: agent.id } } }),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed:", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 502 },
    );
  }
}
