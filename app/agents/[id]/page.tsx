import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  if (!agent) return { title: "Agent not found — CloneMarket" };
  return {
    title: `${agent.name} — CloneMarket`,
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

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white">About this agent</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {agent.description}
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                The expert workflow
              </h2>
              <span className="rounded-full border border-edge-bright bg-panel-2 px-2.5 py-1 text-[11px] font-medium text-accent-soft">
                workflows, not prompts
              </span>
            </div>
            <ol className="mt-3 space-y-2">
              {agent.workflow.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-edge bg-panel px-4 py-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-edge-bright bg-panel-2 font-mono text-xs font-bold text-accent-soft">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-300">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {agent.tools.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-white">Wired tools</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-edge bg-night px-2.5 py-1 font-mono text-xs text-glow"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white">Under the hood</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-edge bg-panel px-4 py-3">
                <dt className="text-xs text-slate-500">Model</dt>
                <dd className="mt-1 font-mono text-xs text-slate-300">
                  {agent.model}
                </dd>
              </div>
              <div className="rounded-xl border border-edge bg-panel px-4 py-3">
                <dt className="text-xs text-slate-500">Memory</dt>
                <dd className="mt-1 text-xs text-slate-300">
                  Self-learning, hourly consolidation
                </dd>
              </div>
              <div className="rounded-xl border border-edge bg-panel px-4 py-3">
                <dt className="text-xs text-slate-500">Runs on</dt>
                <dd className="mt-1 font-mono text-xs text-slate-300">
                  lionclaw · openclaw · hermes
                </dd>
              </div>
            </dl>
          </section>
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

          <div className="rounded-2xl border border-edge bg-panel p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Created by
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-night"
                style={{ backgroundColor: agent.color }}
              >
                {agent.creator.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  {agent.creator.name}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    role="img"
                    aria-label="Verified expert"
                  >
                    <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                    <path
                      d="M8 12.5l2.5 2.5L16 9.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
                <p className="text-xs text-slate-500">{agent.creator.title}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Stars value={agent.creator.rating} />
              <span className="font-medium text-slate-300">
                {agent.creator.rating}
              </span>
              <span>
                ({agent.creator.reviewCount} reviews ·{" "}
                {agent.creator.agentsPublished}{" "}
                {agent.creator.agentsPublished === 1 ? "agent" : "agents"})
              </span>
            </div>
            <p className="mt-3 border-t border-edge pt-3 text-xs leading-relaxed text-slate-400">
              {agent.creator.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
