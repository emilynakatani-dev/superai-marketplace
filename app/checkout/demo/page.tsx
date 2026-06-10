import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoCheckout from "@/components/DemoCheckout";
import { getAgent } from "@/lib/agents";
import {
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  convertFromUsd,
  getCurrency,
} from "@/lib/currencies";

export const metadata: Metadata = {
  title: "Checkout — Project Mural",
};

export default async function DemoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // The mock checkout only exists while real Stripe isn't configured.
  if (process.env.STRIPE_SECRET_KEY) notFound();

  const sp = await searchParams;
  const agentId = typeof sp.agent === "string" ? sp.agent : undefined;
  const agent = agentId ? getAgent(agentId) : undefined;
  if (!agent) notFound();

  const currency =
    typeof sp.currency === "string" &&
    CURRENCY_CODES.includes(sp.currency.toLowerCase())
      ? sp.currency.toLowerCase()
      : DEFAULT_CURRENCY;

  return (
    <DemoCheckout
      agentId={agent.id}
      agentName={agent.name}
      tagline={agent.tagline}
      avatar={agent.avatar}
      amount={convertFromUsd(agent.pricing.amount, currency)}
      symbol={getCurrency(currency).symbol}
      isSubscription={agent.pricing.model === "subscription"}
    />
  );
}
