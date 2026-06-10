import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EarningsPanel from "@/components/EarningsPanel";
import Stars from "@/components/Stars";
import { agents, getAgentCredits } from "@/lib/agents";
import { getCreatorEarnings } from "@/lib/earnings";
import { getPerson, people } from "@/lib/people";

export function generateStaticParams() {
  return Object.keys(people).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return { title: "Creator not found — Project Mural" };
  return {
    title: `${person.name} — Project Mural`,
    description: `${person.role}. ${person.bio}`,
  };
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();

  const earnings = getCreatorEarnings(slug);

  // Agents this person is credited on, and in which role.
  const credited = agents
    .map((agent) => {
      const credits = getAgentCredits(agent);
      if (!credits) return null;
      const isSpecialist = agent.credits.specialist === slug;
      const isBuilder = agent.credits.builder === slug;
      if (!isSpecialist && !isBuilder) return null;
      const role =
        isSpecialist && isBuilder
          ? "Specialist & builder"
          : isSpecialist
            ? "Specialist"
            : "Builder";
      return { agent, role };
    })
    .filter((x): x is { agent: (typeof agents)[number]; role: string } => x !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/#agents"
        className="text-sm text-slate-500 transition-colors hover:text-white"
      >
        ← All agents
      </Link>

      <div className="mt-6 rounded-2xl border border-edge bg-panel p-6">
        <div className="flex items-start gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-night"
            style={{ backgroundColor: person.color }}
          >
            {person.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              {person.name}
              {person.verified && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img" aria-label="Verified expert">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                  <path
                    d="M8 12.5l2.5 2.5L16 9.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </h1>
            <p className="text-sm text-slate-400">{person.role}</p>
            {person.location && (
              <p className="text-xs text-slate-500">{person.location}</p>
            )}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Stars value={person.rating} />
              <span className="font-medium text-slate-300">{person.rating}</span>
              <span>({person.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">{person.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {person.verified && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Identity verified
            </span>
          )}
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-edge-bright bg-panel-2 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-accent hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18v-5.4c0-1.3 0-2.96-1.8-2.96-1.82 0-2.1 1.4-2.1 2.86V21h-4z" />
              </svg>
              LinkedIn
            </a>
          )}
          {person.website && (
            <a
              href={person.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-edge-bright bg-panel-2 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-accent hover:text-white"
            >
              Website ↗
            </a>
          )}
        </div>
      </div>

      {earnings && earnings.lifetime > 0 && (
        <div className="mt-6">
          <EarningsPanel slug={person.slug} earnings={earnings} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">
          Agents by {person.name.split(" ")[0]}
        </h2>
        <div className="mt-3 space-y-2">
          {credited.map(({ agent, role }) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="flex items-center justify-between rounded-xl border border-edge bg-panel px-4 py-3 transition-colors hover:border-edge-bright hover:bg-panel-2"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-lg">
                  {agent.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-slate-500">{agent.tagline}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-edge-bright bg-panel-2 px-2.5 py-1 text-[11px] font-medium text-accent-soft">
                {role}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
