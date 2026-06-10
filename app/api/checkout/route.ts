import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getAgent } from "@/lib/agents";

export async function POST(request: NextRequest) {
  let agentId: unknown;
  try {
    ({ agentId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const agent = typeof agentId === "string" ? getAgent(agentId) : undefined;
  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Demo mode: no Stripe keys configured — use the built-in mock checkout.
  if (!secretKey) {
    return NextResponse.json({
      url: `/checkout/demo?agent=${agent.id}`,
      demo: true,
    });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    request.headers.get("origin") ??
    request.nextUrl.origin;
  const isSubscription = agent.pricing.model === "subscription";

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: agent.pricing.currency,
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
      metadata: { agentId: agent.id },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe checkout failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
