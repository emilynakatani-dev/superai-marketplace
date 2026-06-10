import Link from "next/link";
import Stars from "@/components/Stars";
import { getAgentCredits, type Agent } from "@/lib/agents";
import type { Person } from "@/lib/people";

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" role="img" aria-label="Verified expert">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18v-5.4c0-1.3 0-2.96-1.8-2.96-1.82 0-2.1 1.4-2.1 2.86V21h-4z" />
    </svg>
  );
}

function PersonBlock({ person, label }: { person: Person; label: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <Link
          href={`/creators/${person.slug}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-night transition-transform hover:scale-105"
          style={{ backgroundColor: person.color }}
          aria-label={`${person.name} profile`}
        >
          {person.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </Link>
        <div className="min-w-0">
          <Link
            href={`/creators/${person.slug}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-accent-soft"
          >
            {person.name}
            {person.verified && <VerifiedBadge />}
          </Link>
          <p className="text-xs text-slate-500">{person.role}</p>
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-accent-soft"
            >
              <LinkedInIcon />
              Verify on LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorCard({ agent }: { agent: Agent }) {
  const credits = getAgentCredits(agent);
  if (!credits) return null;
  const { specialist, builder, samePerson } = credits;

  return (
    <div className="rounded-2xl border border-edge bg-panel p-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Created by
      </h3>

      <div className="mt-3 space-y-4">
        {samePerson ? (
          <PersonBlock person={specialist} label="Specialist & builder" />
        ) : (
          <>
            <PersonBlock person={specialist} label="Specialist — domain expert" />
            <div className="border-t border-edge" />
            <PersonBlock person={builder} label="Builder — authored the agent" />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-edge pt-3 text-xs text-slate-500">
        <Stars value={specialist.rating} />
        <span className="font-medium text-slate-300">{specialist.rating}</span>
        <span>({specialist.reviewCount} reviews)</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{specialist.bio}</p>
    </div>
  );
}
