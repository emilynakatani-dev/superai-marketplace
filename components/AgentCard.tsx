import Image from "next/image";
import Link from "next/link";
import Stars from "@/components/Stars";
import { formatPrice, getAgentCredits, type Agent } from "@/lib/agents";

export default function AgentCard({ agent }: { agent: Agent }) {
  const credits = getAgentCredits(agent);
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group flex flex-col rounded-2xl border border-edge bg-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-edge-bright hover:bg-panel-2 hover:shadow-[0_0_32px_rgba(59,130,246,0.15)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="rounded-xl p-[2px]"
            style={{ background: `linear-gradient(135deg, ${agent.color}, transparent 70%)` }}
          >
            <Image
              src={agent.avatar}
              alt={`${agent.name} avatar`}
              width={56}
              height={56}
              className="h-14 w-14 rounded-[10px] object-cover"
            />
          </span>
          <div>
            <h3 className="text-base font-semibold text-white">
              {agent.name}{" "}
              <span aria-hidden="true" className="text-sm">
                {agent.emoji}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              by {credits?.specialist.name ?? "—"}
            </p>
          </div>
        </div>
        <span className="whitespace-nowrap rounded-full border border-edge-bright bg-night px-2.5 py-1 text-xs font-semibold text-accent-soft">
          {formatPrice(agent.pricing)}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {agent.tagline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {agent.specialties.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-md border border-edge bg-night px-2 py-0.5 text-[11px] text-slate-400"
          >
            {s}
          </span>
        ))}
        {agent.specialties.length > 3 && (
          <span className="rounded-md border border-edge bg-night px-2 py-0.5 text-[11px] text-slate-500">
            +{agent.specialties.length - 3}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-edge pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Stars value={agent.rating} />
          <span className="font-medium text-slate-300">{agent.rating}</span>
          <span>({agent.reviewCount})</span>
        </span>
        <span className="font-mono">{agent.runs.toLocaleString()} runs</span>
      </div>
    </Link>
  );
}
