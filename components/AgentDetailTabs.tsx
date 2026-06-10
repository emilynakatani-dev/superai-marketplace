"use client";

import Link from "next/link";
import { useState } from "react";
import Stars from "@/components/Stars";
import type { Agent, AgentSkill } from "@/lib/agents";

type Tab = "overview" | "skills" | "reviews";

export default function AgentDetailTabs({ agent }: { agent: Agent }) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: `Skills (${agent.skills.length})` },
    { id: "reviews", label: `Reviews (${agent.reviewCount})` },
  ];

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Agent details"
        className="flex gap-1 border-b border-edge"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-accent text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && <OverviewTab agent={agent} />}
        {tab === "skills" && <SkillsTab agent={agent} />}
        {tab === "reviews" && <ReviewsTab agent={agent} />}
      </div>
    </div>
  );
}

function OverviewTab({ agent }: { agent: Agent }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-white">About this agent</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {agent.description}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Who it&apos;s for</h2>
        <ul className="mt-3 space-y-2">
          {agent.whoFor.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm text-slate-300">
              <svg
                className="mt-0.5 shrink-0 text-accent-soft"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">The expert workflow</h2>
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
              <span className="text-sm leading-relaxed text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <UnderTheHood agent={agent} />
    </div>
  );
}

function SkillsTab({ agent }: { agent: Agent }) {
  return (
    <div className="space-y-8">
      <section className="space-y-5">
        {agent.skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </section>

      {/* Human-in-the-loop vetting */}
      <section className="rounded-2xl border border-edge bg-gradient-to-b from-panel to-panel-2 p-5">
        <div className="flex items-center gap-2">
          <svg
            className="text-glow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-lg font-semibold text-white">
            Human-in-the-loop: how the expert vetted this
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {agent.vetting.intro}
        </p>

        <div className="mt-4 space-y-3">
          {agent.vetting.notes.map((note) => (
            <div
              key={note.misconception}
              className="rounded-xl border border-edge bg-night/60 p-4"
            >
              <p className="flex items-start gap-2 text-sm text-slate-400">
                <span className="mt-0.5 shrink-0 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
                  Myth
                </span>
                <span className="italic">{note.misconception}</span>
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-200">
                <span className="mt-0.5 shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                  Vetted
                </span>
                <span>{note.reality}</span>
              </p>
            </div>
          ))}
        </div>

        {agent.vetting.sources.length > 0 && (
          <div className="mt-4 border-t border-edge pt-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Sources the specialist trusts
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {agent.vetting.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-edge bg-panel px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-accent hover:text-white"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {agent.tools.length > 0 && (
        <section>
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
    </div>
  );
}

function SkillCard({ skill }: { skill: AgentSkill }) {
  return (
    <div className="rounded-2xl border border-edge bg-panel p-5">
      <h3 className="text-base font-semibold text-white">{skill.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{skill.summary}</p>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch">
        {skill.pipeline.map((stage, i) => (
          <div key={stage.label} className="flex items-stretch gap-2 md:flex-1">
            <div className="flex-1 rounded-xl border border-edge bg-night/60 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-accent-soft">
                  {stage.label}
                </span>
                {stage.tool &&
                  (stage.tool.startsWith("Exa") ? (
                    <Link
                      href="/exa"
                      className="rounded border border-edge-bright bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-glow transition-colors hover:border-glow"
                      title="How agents use Exa"
                    >
                      {stage.tool} ↗
                    </Link>
                  ) : (
                    <span className="rounded border border-edge-bright bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-glow">
                      {stage.tool}
                    </span>
                  ))}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {stage.detail}
              </p>
            </div>
            {i < skill.pipeline.length - 1 && (
              <div
                className="flex shrink-0 items-center justify-center text-edge-bright"
                aria-hidden="true"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab({ agent }: { agent: Agent }) {
  // Distribution derived from the sample reviews shown.
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: agent.reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const total = agent.reviews.length || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-edge bg-panel p-5 sm:flex-row sm:items-center">
        <div className="text-center sm:w-40 sm:shrink-0">
          <div className="text-4xl font-bold text-white">{agent.rating}</div>
          <div className="mt-1 flex justify-center">
            <Stars value={agent.rating} />
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {agent.reviewCount.toLocaleString()} reviews
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 text-right">{d.star}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" className="text-amber-400" aria-hidden="true">
                <path
                  d="M12 2l2.92 6.26 6.87.84-5.07 4.7 1.33 6.79L12 17.27l-6.05 3.32 1.33-6.79-5.07-4.7 6.87-.84L12 2z"
                  fill="currentColor"
                />
              </svg>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-edge">
                <div
                  className="h-full rounded-full bg-amber-400/80"
                  style={{ width: `${(d.count / total) * 100}%` }}
                />
              </div>
              <span className="w-4 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {agent.reviews.map((r) => (
          <div key={r.author + r.date} className="rounded-2xl border border-edge bg-panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{r.author}</p>
                {r.role && <p className="text-xs text-slate-500">{r.role}</p>}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Stars value={r.rating} />
                <span className="text-[11px] text-slate-500">{r.date}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{r.body}</p>
            {r.verifiedPurchase && (
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Verified purchase
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UnderTheHood({ agent }: { agent: Agent }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Under the hood</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-edge bg-panel px-4 py-3">
          <dt className="text-xs text-slate-500">Model</dt>
          <dd className="mt-1 font-mono text-xs text-slate-300">{agent.model}</dd>
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
  );
}
