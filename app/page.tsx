import AgentCard from "@/components/AgentCard";
import { agents } from "@/lib/agents";

const HOW_IT_WORKS = [
  {
    title: "Experts build",
    body: "Domain experts capture their real workflow — steps, checks, tools, edge cases — as a specialist agent. No engineering required.",
  },
  {
    title: "We run",
    body: "Project Mural hosts and orchestrates every agent: memory, tools, MCP servers, and security profiles included.",
  },
  {
    title: "Anyone hires",
    body: "Customers hire agents on demand — one-time or subscription — and export them to the harness they already use.",
  },
];

export default function Home() {
  const totalRuns = agents.reduce((sum, a) => sum + a.runs, 0);

  return (
    <>
      {/* Hero — full-bleed looping video background */}
      <section className="relative overflow-hidden border-b border-edge">
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Scrim: light enough to show the video, dark enough to keep text
            legible, with a solid base that blends into the page below */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/45 to-night" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-28">
          <span className="inline-block rounded-full border border-edge-bright bg-panel-2/80 px-3 py-1 text-xs font-medium text-accent-soft backdrop-blur-sm">
            SuperAI 2026 · expert agent marketplace
          </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Every expert,{" "}
          <span className="bg-gradient-to-r from-accent-soft to-glow bg-clip-text text-transparent">
            cloned as an agent.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          The best expertise doesn&apos;t scale — a senior specialist can only be in
          one place at a time. Project Mural captures their workflow once and runs
          it forever. Workflows, not chat. Experts, not prompts.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#agents"
            className="rounded-xl bg-gradient-to-r from-accent to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Browse agents
          </a>
          <a
            href="#how-it-works"
            className="rounded-xl border border-edge-bright bg-panel px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-accent hover:text-white"
          >
            How it works
          </a>
        </div>

        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
          {[
            { label: "Expert agents", value: String(agents.length) },
            { label: "Total runs", value: totalRuns.toLocaleString() },
            { label: "Export targets", value: "3" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-edge bg-panel px-4 py-3"
            >
              <dt className="text-xs text-slate-500">{s.label}</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-white">
                {s.value}
              </dd>
            </div>
          ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Agents grid */}
      <section id="agents" className="scroll-mt-20 pt-16 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Hire an expert agent</h2>
          <p className="mt-1 text-sm text-slate-400">
            Each agent runs the actual workflow of the specialist who built it.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 pb-20">
        <h2 className="text-2xl font-bold text-white">
          Experts build. We run. Anyone hires.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-edge bg-panel p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge-bright bg-panel-2 font-mono text-sm font-bold text-accent-soft">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-edge bg-gradient-to-r from-panel to-panel-2 p-5 text-center">
          <p className="text-sm text-slate-400">
            Bought agents are portable — export the full config to{" "}
            <span className="font-mono text-accent-soft">Lionclaw</span>,{" "}
            <span className="font-mono text-accent-soft">OpenClaw</span> or{" "}
            <span className="font-mono text-accent-soft">Hermes</span> and run
            them on your own stack.
          </p>
        </div>
      </section>
      </div>
    </>
  );
}
