import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AgentDetailTabs from "@/components/AgentDetailTabs";
import CreatorCard from "@/components/CreatorCard";
import PurchasePanel from "@/components/PurchasePanel";
import Stars from "@/components/Stars";
import { agents, getAgent } from "@/lib/agents";

interface PageParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) return { title: "Agent not found — Project Mural" };
  return {
    title: `${agent.name} — Project Mural`,
    description: agent.tagline,
  };
}

export default async function AgentPage({ params, searchParams }: PageParams) {
  const { id } = await params;
  const sp = await searchParams;
  const agent = getAgent(id);
  if (!agent) notFound();

  const justPurchased = sp.purchase === "success";
  const cancelled = sp.purchase === "cancelled";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/#agents"
        className="text-sm text-slate-500 transition-colors hover:text-white"
      >
        ← All agents
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column — agent info */}
        <div>
          <div className="flex items-start gap-5">
            <span
              className="shrink-0 rounded-2xl p-[3px]"
              style={{
                background: `linear-gradient(135deg, ${agent.color}, transparent 75%)`,
              }}
            >
              <Image
                src={agent.avatar}
                alt={`${agent.name} avatar`}
                width={96}
                height={96}
                preload
                className="h-24 w-24 rounded-[13px] object-cover"
              />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {agent.name}{" "}
                <span aria-hidden="true" className="text-2xl">
                  {agent.emoji}
                </span>
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {agent.tagline}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Stars value={agent.rating} />
                  <span className="font-medium text-slate-300">
                    {agent.rating}
                  </span>
                  <span>({agent.reviewCount} reviews)</span>
                </span>
                <span className="font-mono">
                  {agent.runs.toLocaleString()} runs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {agent.specialties.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-edge bg-panel px-2.5 py-1 text-xs text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>

          {/* On phones the right column stacks below the fold, so the
              purchase panel also renders here, right under the header. */}
          <div className="mt-6 lg:hidden">
            <PurchasePanel
              agentId={agent.id}
              agentName={agent.name}
              pricingModel={agent.pricing.model}
              amount={agent.pricing.amount}
              justPurchased={justPurchased}
              cancelled={cancelled}
            />
          </div>

          <AgentDetailTabs agent={agent} />
        </div>

        {/* Right column — purchase + creator */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="hidden lg:block">
            <PurchasePanel
              agentId={agent.id}
              agentName={agent.name}
              pricingModel={agent.pricing.model}
              amount={agent.pricing.amount}
              justPurchased={justPurchased}
              cancelled={cancelled}
            />
          </div>

          <CreatorCard agent={agent} />
        </div>
      </div>
    </div>
  );
}
