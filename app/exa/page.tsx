import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Powered by Exa — how agents source the truth | Project Mural",
  description:
    "Project Mural agents don't trust the top search result. They source like researchers with Exa — neural search across many trusted sources, clean highlights, and cited verification.",
};

const WHAT_EXA_DOES = [
  {
    title: "Neural search",
    body: "Finds pages by meaning, not just keywords — so it surfaces the right source even when the page never uses your exact words.",
    icon: (
      <path d="M12 3a4 4 0 014 4c1.7.6 3 2.2 3 4a4 4 0 01-2 3.5V16a3 3 0 01-3 3h-4a3 3 0 01-3-3v-1.5A4 4 0 015 11c0-1.8 1.3-3.4 3-4a4 4 0 014-4z" />
    ),
  },
  {
    title: "Sources broadly",
    body: "Returns many independent, high-quality pages in one call — across News, Research, Companies and People verticals — so an agent never leans on a single result.",
    icon: <path d="M4 6h16M4 12h16M4 18h10" />,
  },
  {
    title: "Clean content + highlights",
    body: "The Contents API extracts parsed text and pulls token-efficient highlights — the exact passages that matter — instead of dumping whole pages.",
    icon: <path d="M5 4h11l3 3v13H5zM9 12h6M9 16h4" />,
  },
  {
    title: "Find similar",
    body: "Hand it one good source and it returns more like it, semantically — perfect for widening a trusted set fast.",
    icon: <path d="M7 7h6v6H7zM14 14h3v3h-3zM13 10l3 3" />,
  },
  {
    title: "Filters that matter",
    body: "Restrict to trusted domains, recent dates, or a vertical — so results stay authoritative and current, not SEO-spam.",
    icon: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  },
  {
    title: "Cited answers & research",
    body: "The Answer and Research endpoints return grounded, citation-backed, structured results an agent can actually verify.",
    icon: <path d="M12 4v16M6 8l6-4 6 4M8 20h8" />,
  },
];

const EMILY_FLOW = [
  {
    label: "Input",
    detail: "Symptoms, water parameters, affected areas, and a photo.",
  },
  {
    label: "Exa neural search",
    detail:
      "Pull from multiple trusted aquaculture sources at once — university extensions, expert references — not the first blog. Domain- and vertical-filtered.",
    exa: true,
  },
  {
    label: "Contents + highlights",
    detail:
      "Extract the exact passages that differentiate the diseases, token-efficiently — no whole-page dumps.",
    exa: true,
  },
  {
    label: "Cross-verify",
    detail:
      "Check the candidate diagnosis against Emily's vetted memory (Ich is motile; Epistylis is stalked and sessile). Conflicts get flagged, not repeated.",
  },
  {
    label: "Cited output",
    detail:
      "An honest, sourced diagnosis with confidence — and “confirm with a microscope skin-scrape before treating.”",
  },
];

function ExaBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-edge-bright bg-panel-2 px-3 py-1 text-xs font-medium text-glow">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13 2L3 14h7l-1 8 11-13h-7z" />
      </svg>
      Powered by Exa
    </span>
  );
}

export default function ExaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/#agents"
        className="text-sm text-slate-500 transition-colors hover:text-white"
      >
        ← All agents
      </Link>

      {/* Hero */}
      <section className="mt-6 text-center">
        <div className="flex justify-center">
          <ExaBadge />
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Agents that source the truth, not the{" "}
          <span className="bg-gradient-to-r from-accent-soft to-glow bg-clip-text text-transparent">
            top result.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Most online info is wrong, contradictory, or copied between blogs — and
          generic chatbots confidently repeat the first hit. Project Mural agents
          research like a specialist would, using{" "}
          <a
            href="https://exa.ai"
            target="_blank"
            rel="noreferrer"
            className="text-accent-soft underline-offset-2 hover:underline"
          >
            Exa
          </a>{" "}
          to find and verify across many trusted sources.
        </p>
      </section>

      {/* What Exa does */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-white">What Exa does</h2>
        <p className="mt-1 text-sm text-slate-400">
          A search API built for AI agents — semantic, source-rich, and verifiable.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHAT_EXA_DOES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-edge bg-panel p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-edge-bright bg-panel-2 text-glow">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The creative implementation */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-white">
          The creative implementation: diagnosing a sick fish
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          The same question, two very different answers. This is how Emily turns
          Exa into a researcher&apos;s sourcing pipeline.
        </p>

        {/* Contrast cards */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5">
            <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
              Top-result chatbot
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              <span className="text-slate-500">&ldquo;White spots on my fish?&rdquo;</span>{" "}
              → grabs the first blog → <span className="font-medium text-white">&ldquo;It&apos;s Ich, add salt and raise the heat.&rdquo;</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-red-300/90">
              Often wrong. Identical-looking Epistylis ignores that treatment —
              and the heat can make a misdiagnosed case worse.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/15 p-5">
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              Emily, sourcing with Exa
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Searches <span className="font-medium text-white">many trusted aquaculture sources at once</span>, pulls the exact
              differentiation passages, and cross-checks them against vetted
              memory before answering.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-300/90">
              Result: &ldquo;Could be Ich <em>or</em> Epistylis — confirm with a
              microscope scrape (Ich moves; Epistylis is stalked) before
              treating.&rdquo; Honest, cited, correct.
            </p>
          </div>
        </div>

        {/* Emily's Exa pipeline */}
        <div className="mt-5 rounded-2xl border border-edge bg-gradient-to-b from-panel to-panel-2 p-5">
          <div className="flex items-center gap-2">
            <ExaBadge />
            <span className="text-xs text-slate-500">Emily · fish-disease diagnosis</span>
          </div>
          <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-stretch">
            {EMILY_FLOW.map((stage, i) => (
              <div key={stage.label} className="flex items-stretch gap-2 lg:flex-1">
                <div
                  className={`flex-1 rounded-xl border p-3 ${
                    stage.exa
                      ? "border-edge-bright bg-night/70 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                      : "border-edge bg-night/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-[11px] font-bold uppercase tracking-wide ${
                        stage.exa ? "text-glow" : "text-accent-soft"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {stage.detail}
                  </p>
                </div>
                {i < EMILY_FLOW.length - 1 && (
                  <div
                    className="flex shrink-0 items-center justify-center text-edge-bright"
                    aria-hidden="true"
                  >
                    <span className="lg:hidden">↓</span>
                    <span className="hidden lg:inline">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond fish */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-white">Beyond fish</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-edge bg-panel p-5">
            <h3 className="text-sm font-semibold text-white">
              Marcus — verified research briefs 🔎
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Fans out Exa searches across news, papers and forums, then requires
              <span className="text-slate-200"> two independent sources per claim</span>,
              scores credibility, and flags conflicts. The output is a cited brief
              — never a single-source answer.
            </p>
          </div>
          <div className="rounded-2xl border border-edge bg-panel p-5">
            <h3 className="text-sm font-semibold text-white">
              Eugene — brand & leak monitoring 🕶️
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Uses Exa to sweep news and the wider web for brand, domain and
              credential mentions, then verifies recency and authenticity before
              raising an alert — signal, not noise.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 rounded-2xl border border-edge bg-gradient-to-r from-panel to-panel-2 p-6 text-center">
        <p className="text-sm text-slate-400">
          Every Project Mural agent that touches the web sources it like a
          researcher — with Exa.
        </p>
        <Link
          href="/#agents"
          className="mt-4 inline-block rounded-xl bg-gradient-to-r from-accent to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Browse the agents
        </Link>
      </section>
    </div>
  );
}
