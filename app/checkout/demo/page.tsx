import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoCheckout from "@/components/DemoCheckout";
import { getAgent } from "@/lib/agents";

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

  return (
    <DemoCheckout
      agentId={agent.id}
      agentName={agent.name}
      tagline={agent.tagline}
      avatar={agent.avatar}
      amount={agent.pricing.amount}
      isSubscription={agent.pricing.model === "subscription"}
    />
  );
}
