import { getPerson, type Person } from "./people";

export type PricingModel = "one_time" | "subscription";

export interface AgentPricing {
  model: PricingModel;
  /** Price in whole USD */
  amount: number;
  currency: "usd";
  interval?: "month";
}

export interface McpServer {
  url: string;
  transport: string;
  enabled: boolean;
}

/** A stage in a skill's run pipeline (input → search → verify → output). */
export interface SkillStage {
  label: string;
  detail: string;
  /** Optional tool/source that powers this stage, e.g. "Exa API". */
  tool?: string;
}

export interface AgentSkill {
  name: string;
  summary: string;
  pipeline: SkillStage[];
}

/** A human-in-the-loop vetting note: what the internet gets wrong vs. what the
 *  expert actually knows. */
export interface VettingNote {
  misconception: string;
  reality: string;
}

export interface Vetting {
  intro: string;
  notes: VettingNote[];
  sources: { label: string; url: string }[];
}

export interface Review {
  author: string;
  role?: string;
  rating: number;
  /** Absolute date string. */
  date: string;
  body: string;
  verifiedPurchase?: boolean;
}

export type RatingBreakdown = Record<1 | 2 | 3 | 4 | 5, number>;

export interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Who the agent is for. */
  whoFor: string[];
  specialties: string[];
  model: string;
  color: string;
  avatar: string;
  emoji: string;
  systemPrompt: string;
  tools: string[];
  mcpServers: McpServer[];
  /** The high-level expert workflow (steps the agent runs). */
  workflow: string[];
  /** Discrete skills the agent ships with, each with its own run pipeline. */
  skills: AgentSkill[];
  /** How the specialist vetted the knowledge (human-in-the-loop). */
  vetting: Vetting;
  /** Credits: a specialist (domain expert) and a builder. Slugs into people. */
  credits: { specialist: string; builder: string };
  reviews: Review[];
  pricing: AgentPricing;
  rating: number;
  reviewCount: number;
  /** Full distribution across all ratings (sums to reviewCount). */
  reviewBreakdown: RatingBreakdown;
  runs: number;
  featured: boolean;
}

export const agents: Agent[] = [
  {
    id: "emily",
    name: "Emily",
    tagline: "Aquaculture & product expert — bilingual JP/EN, with a 3D and gaming edge",
    description:
      "Emily is the cloned workflow of a Tokyo-based aquaculture and product consultant. She walks customers from goal to purchase plan: matching species and equipment against compatibility tables, checking Japanese supplier catalogs, and flagging the edge cases — regulated species, incompatible tankmates, shipping rules — that a generic model breezes past. Her standout skill is fish-disease diagnosis: she sources current evidence, cross-checks it against a vetted knowledge base, and refuses to give the confident-but-wrong answers generic chatbots are notorious for.",
    whoFor: [
      "Aquarium retailers and breeders who need fast, correct stocking and health advice",
      "Hobbyists who've been burned by generic chatbot fish advice",
      "Product teams building aquarium hardware, 3D visualizers, or fish-themed games",
    ],
    specialties: ["Aquaculture", "Fish disease diagnosis", "Product strategy", "3D & gaming", "日本語 / English"],
    model: "deepseek:deepseek-v4-flash",
    color: "#f472b6",
    avatar: "/avatars/emily.jpg",
    emoji: "🐠",
    systemPrompt:
      "You are Emily, a bilingual (Japanese/English) aquaculture and product consultant. Match species and equipment against compatibility tables, check Japanese supplier catalogs, flag regulated species and shipping rules, and deliver a clear purchase plan. Advise on 3D product visualization and gaming integrations when relevant. Keep the tone friendly and upbeat.",
    tools: [],
    mcpServers: [],
    workflow: [
      "Clarify the customer's goal and constraints — budget, tank size, region, language (JP/EN)",
      "Match species and equipment against compatibility and water-parameter tables",
      "Check seasonal availability and Japanese supplier catalogs",
      "Flag edge cases: incompatible tankmates, regulated species, import and shipping rules",
      "Deliver a purchase plan, with 3D visualization or gaming tie-ins when relevant",
    ],
    skills: [
      {
        name: "Fish disease diagnosis",
        summary:
          "Diagnoses a sick fish from symptoms, water parameters, and photos — then verifies the call against a vetted disease knowledge base before recommending treatment. Built to avoid the confident misdiagnoses generic chatbots make.",
        pipeline: [
          {
            label: "Input",
            detail:
              "Collect symptoms, water parameters (pH, temp, ammonia, nitrite), affected body areas, and a photo if available.",
          },
          {
            label: "Source",
            detail:
              "Search and pull from multiple trusted aquaculture sources — university extensions, peer aquarist references — not just the top blog result.",
            tool: "Exa API",
          },
          {
            label: "Verify",
            detail:
              "Cross-check the candidate diagnosis against the SKILL.md process and Emily's vetted fish-disease memory (e.g. the Ich-vs-Epistylis differentiation). Conflicting or single-source claims are flagged, not repeated.",
            tool: "skills.md + memory",
          },
          {
            label: "Output",
            detail:
              "Return the most likely diagnosis with a confidence level, the differentiators that rule alternatives in or out, the correct treatment, and when to scope a skin-scrape under a microscope before treating.",
          },
        ],
      },
      {
        name: "Stocking & compatibility planning",
        summary:
          "Builds a stocking plan for a given tank — species, bioload, tankmate compatibility, and equipment — with regulated-species and shipping checks for the customer's region.",
        pipeline: [
          { label: "Input", detail: "Tank size, water type, existing livestock, region, and budget." },
          { label: "Match", detail: "Apply compatibility and water-parameter tables; compute bioload headroom." },
          { label: "Verify", detail: "Check regulated/invasive species lists and import rules for the region." },
          { label: "Output", detail: "A staged stocking plan with equipment list and supplier availability." },
        ],
      },
    ],
    vetting: {
      intro:
        "Most online fish-health advice is wrong, contradictory, or copied between blogs — and generic LLMs confidently repeat it. Yuki spent 15 years learning what actually works on real tanks. Emily encodes that judgment: she treats the internet as a lead, not an answer, and verifies every diagnosis against this hand-vetted knowledge before she'll recommend a treatment.",
      notes: [
        {
          misconception:
            "\"White spots on a fish means Ich — dose salt, raise the temperature, done.\"",
          reality:
            "White spots look identical to Epistylis, a stalked ciliate that completely ignores Ich treatment. Ich spots are flat, discrete, equally-sized salt grains; Epistylis is fuzzy, raised, varies in size, and signals poor water quality with a bacterial co-infection. The only sure call is a skin-scrape under the microscope: Ich is a motile ciliate that moves; Epistylis is anchored by a stalk and stays put. Treat the wrong one and the fish gets worse.",
        },
        {
          misconception: "\"Crank the heat to speed up any white-spot cure.\"",
          reality:
            "Heat accelerates Ich's life cycle, but on a misdiagnosed Epistylis case it stresses the fish and feeds the underlying bacterial infection. Confirm the parasite before reaching for the heater.",
        },
        {
          misconception: "\"A photo and ChatGPT are enough to diagnose it.\"",
          reality:
            "A photo cannot distinguish a motile ciliate from a sessile stalked one — that's a microscope call. Emily says so plainly and tells you what to scope for, instead of guessing.",
        },
      ],
      sources: [
        { label: "Aquarium Science — Epistylis", url: "https://aquariumscience.org/index.php/10-2-4-epistylis/" },
        { label: "Aquarium Science — Ich", url: "https://aquariumscience.org/index.php/10-2-2-ich/" },
        { label: "UF/IFAS — Ichthyophthirius (White Spot)", url: "https://ask.ifas.ufl.edu/publication/FA006" },
        { label: "FishLore — Ich vs Epistylis", url: "https://www.fishlore.com/aquariumfishforum/threads/ich-vs-epistylis-how-to-differentiate.531462/" },
      ],
    },
    credits: { specialist: "yuki-tanaka", builder: "kenji-sato" },
    reviews: [
      {
        author: "Daniel R.",
        role: "Aquarium shop owner",
        rating: 5,
        date: "May 28, 2026",
        body: "Caught an Epistylis case my staff had been treating as Ich for a week. Emily asked for a scrape result before committing — that alone paid for the agent.",
        verifiedPurchase: true,
      },
      {
        author: "Mio K.",
        role: "Hobbyist breeder",
        rating: 5,
        date: "May 19, 2026",
        body: "Bilingual support is the real deal — I switch to Japanese mid-chat and nothing is lost. Stocking plan was spot on for my region's import rules.",
        verifiedPurchase: true,
      },
      {
        author: "Greg P.",
        role: "Reef keeper",
        rating: 4,
        date: "May 9, 2026",
        body: "Diagnosis workflow is excellent and refreshingly honest about uncertainty. Would love deeper saltwater coral coverage next.",
        verifiedPurchase: true,
      },
    ],
    pricing: { model: "one_time", amount: 49, currency: "usd" },
    rating: 4.9,
    reviewCount: 214,
    reviewBreakdown: { 5: 198, 4: 13, 3: 2, 2: 1, 1: 0 },
    runs: 1284,
    featured: true,
  },
  {
    id: "eugene",
    name: "Eugene",
    tagline: "SEO expert with a security researcher's eye — from SERP to dark web",
    description:
      "Eugene clones the workflow of a senior SEO consultant who moonlights in threat intelligence. He runs full technical audits, maps keyword and SERP gaps against competitors, screens backlink profiles for toxic domains, and — the part generic models can't do — monitors dark-web and leak channels for brand or domain mentions. Every engagement ends in a prioritized 30-day action plan with measurable KPIs.",
    whoFor: [
      "Founders and marketers who need an honest technical SEO audit, not fluff",
      "Brands that want early warning when their domain shows up in leaks",
      "Agencies that need a senior second opinion on backlink risk",
    ],
    specialties: ["SEO audits", "SERP analysis", "Backlink screening", "Dark-web monitoring"],
    model: "deepseek:deepseek-v4-flash",
    color: "#60a5fa",
    avatar: "/avatars/eugene.jpg",
    emoji: "🕶️",
    systemPrompt:
      "You are Eugene, a senior SEO consultant with a security-research background. Run technical audits, keyword and SERP gap analysis, and backlink screening; monitor dark-web and leak channels for brand and domain mentions; end every engagement with a prioritized 30-day action plan with measurable KPIs.",
    tools: [],
    mcpServers: [],
    workflow: [
      "Crawl and audit the site: structure, Core Web Vitals, index coverage",
      "Run keyword and SERP gap analysis against the top competitors",
      "Screen backlink quality and shortlist toxic domains for disavowal",
      "Monitor dark-web and leak channels for brand, domain, and credential mentions",
      "Deliver a prioritized 30-day action plan with measurable KPIs",
    ],
    skills: [
      {
        name: "Technical SEO audit",
        summary: "Crawls a site and produces a prioritized, evidence-backed list of technical fixes ranked by traffic impact.",
        pipeline: [
          { label: "Input", detail: "Target domain, key landing pages, and competitor set." },
          { label: "Crawl", detail: "Audit structure, Core Web Vitals, index coverage, and schema." },
          { label: "Verify", detail: "Confirm each issue reproduces and estimate its traffic impact before listing it." },
          { label: "Output", detail: "A prioritized fix list with expected impact and effort." },
        ],
      },
      {
        name: "Dark-web brand monitoring",
        summary: "Sweeps leak channels and paste sites for brand, domain, and credential mentions and triages what's actually actionable.",
        pipeline: [
          { label: "Input", detail: "Brand names, domains, and exec identifiers to watch." },
          { label: "Source", detail: "Search leak channels, paste sites, and forums.", tool: "Exa API" },
          { label: "Verify", detail: "Filter noise and confirm a mention is genuine and recent." },
          { label: "Output", detail: "A triaged alert list with severity and recommended response." },
        ],
      },
    ],
    vetting: {
      intro:
        "SEO advice online is a sea of outdated tactics and vendor spam. Eugene ran agency SEO for a decade and security research for five years; he encodes what still moves rankings and what just wastes a quarter.",
      notes: [
        {
          misconception: "\"More backlinks always help.\"",
          reality:
            "A toxic backlink profile actively suppresses rankings. Eugene screens link quality and shortlists domains for disavowal rather than chasing raw counts.",
        },
        {
          misconception: "\"A leaked password list with your domain means you're hacked.\"",
          reality:
            "Most credential dumps are recycled or fabricated. Eugene verifies recency and authenticity before raising an alarm, so you act on real exposure, not noise.",
        },
      ],
      sources: [
        { label: "Google Search Central — link spam", url: "https://developers.google.com/search/docs/essentials/spam-policies" },
      ],
    },
    credits: { specialist: "eugene-volkov", builder: "eugene-volkov" },
    reviews: [
      {
        author: "Sasha M.",
        role: "Growth lead",
        rating: 5,
        date: "May 22, 2026",
        body: "The audit was brutally specific and ranked by impact. We shipped the top five and recovered a page-two cluster in three weeks.",
        verifiedPurchase: true,
      },
      {
        author: "Tom B.",
        role: "Agency owner",
        rating: 4,
        date: "May 3, 2026",
        body: "Dark-web monitoring flagged a real credential leak we'd have missed. Subscription pays for itself as an early-warning system.",
        verifiedPurchase: true,
      },
    ],
    pricing: { model: "subscription", amount: 29, currency: "usd", interval: "month" },
    rating: 4.7,
    reviewCount: 156,
    reviewBreakdown: { 5: 128, 4: 18, 3: 6, 2: 3, 1: 1 },
    runs: 2371,
    featured: true,
  },
  {
    id: "carlos",
    name: "Carlos",
    tagline: "Fractional CTO for AI and web3 — architecture, risk, and roadmap",
    description:
      "Carlos packages the judgment of a fractional CTO who has shipped both AI products and on-chain protocols. He scopes the technical problem, reviews your AI stack and chain selection, runs a security and cost checklist (audits, gas, infra), and makes the build-vs-buy calls founders usually pay a retainer for. Output is an investor-ready technical summary, not a wall of options.",
    whoFor: [
      "Non-technical founders who need CTO-grade judgment before they hire one",
      "Teams choosing an AI or chain stack and weighing build-vs-buy",
      "Investors who want a fast technical read on a deal",
    ],
    specialties: ["AI architecture", "Web3 & blockchain", "CTO advisory", "Technical due diligence"],
    model: "deepseek:deepseek-v4-flash",
    color: "#d8508a",
    avatar: "/avatars/carlos.jpg",
    emoji: "🛠️",
    systemPrompt:
      "You are Carlos, a fractional CTO for AI and web3 products. Scope the technical problem, review architecture and chain selection, run security and cost checklists, make explicit build-vs-buy recommendations, and deliver an investor-ready technical summary.",
    tools: [],
    mcpServers: [],
    workflow: [
      "Scope the technical problem, constraints, and stage of the company",
      "Review architecture: AI stack, chain selection, smart-contract risk surface",
      "Run the security and cost checklist — audits, gas, infra, vendor lock-in",
      "Make explicit build-vs-buy recommendations with trade-offs",
      "Deliver an investor-ready technical summary and 90-day roadmap",
    ],
    skills: [
      {
        name: "Architecture review",
        summary: "Reviews an AI/web3 stack against the company's stage and surfaces the risks and costs that bite later.",
        pipeline: [
          { label: "Input", detail: "Current stack, traffic, team size, and stage." },
          { label: "Assess", detail: "Map the architecture, chain selection, and smart-contract risk surface." },
          { label: "Verify", detail: "Pressure-test against security and cost checklists before recommending." },
          { label: "Output", detail: "A ranked risk list with build-vs-buy calls and a 90-day roadmap." },
        ],
      },
      {
        name: "Technical due diligence",
        summary: "Produces a fast, investor-ready technical read on a product or deal.",
        pipeline: [
          { label: "Input", detail: "Repo access or architecture docs, plus the investment thesis." },
          { label: "Review", detail: "Code health, scalability, security posture, and key-person risk." },
          { label: "Verify", detail: "Separate real blockers from cosmetic concerns." },
          { label: "Output", detail: "A one-page technical summary with go/no-go flags." },
        ],
      },
    ],
    vetting: {
      intro:
        "Carlos has been the CTO who has to live with the architecture decision. He encodes the trade-offs that only show up at scale, not the hype-cycle defaults.",
      notes: [
        {
          misconception: "\"Put it on-chain because it's web3.\"",
          reality:
            "Most data should never touch a chain. Carlos pushes back on on-chain-by-default and reserves it for what genuinely needs trustless settlement.",
        },
      ],
      sources: [],
    },
    credits: { specialist: "carlos-mendoza", builder: "carlos-mendoza" },
    reviews: [
      {
        author: "Lena F.",
        role: "Solo founder",
        rating: 5,
        date: "May 25, 2026",
        body: "Talked me out of building a custom vector DB and into a managed one. Saved months. The summary went straight into my investor update.",
        verifiedPurchase: true,
      },
    ],
    pricing: { model: "one_time", amount: 99, currency: "usd" },
    rating: 4.8,
    reviewCount: 91,
    reviewBreakdown: { 5: 78, 4: 9, 3: 3, 2: 1, 1: 0 },
    runs: 642,
    featured: false,
  },
  {
    id: "marcus",
    name: "Marcus",
    tagline: "Deep web research on demand — Exa-powered, source-verified",
    description:
      "Marcus is a research analyst's retrieval workflow turned into an agent. He decomposes your question, fans out Exa searches across news, papers, and forums, cross-verifies claims across independent sources, and scores credibility before anything reaches you. The deliverable is a cited brief — never a single-source answer.",
    whoFor: [
      "Analysts and operators who need a fast, cited brief they can trust",
      "Teams making decisions where a single wrong source is expensive",
      "Anyone tired of confident, uncited chatbot answers",
    ],
    specialties: ["Web research", "Exa search", "Source verification", "Cited briefs"],
    model: "deepseek:deepseek-v4-flash",
    color: "#5b8def",
    avatar: "/avatars/marcus.png",
    emoji: "🔎",
    systemPrompt:
      "You are Marcus, a research analyst specializing in Exa-powered web research. Decompose questions into independent sub-queries, fan out searches across news, papers, and forums, cross-verify every claim against independent sources, and respond with a cited brief — never a single-source answer.",
    tools: [],
    mcpServers: [],
    workflow: [
      "Decompose the research question into independent sub-queries",
      "Fan out Exa searches across news, papers, and community sources",
      "Cross-verify every claim against at least two independent sources",
      "Score source credibility and flag conflicting evidence",
      "Deliver a cited brief with confidence levels per claim",
    ],
    skills: [
      {
        name: "Verified research brief",
        summary: "Answers an open question with a cited brief where every claim is cross-checked across independent sources.",
        pipeline: [
          { label: "Input", detail: "The research question and any scope constraints." },
          { label: "Source", detail: "Fan out across news, papers, and forums for independent coverage.", tool: "Exa API" },
          { label: "Verify", detail: "Require two independent sources per claim; score credibility and flag conflicts." },
          { label: "Output", detail: "A cited brief with a confidence level on every claim." },
        ],
      },
    ],
    vetting: {
      intro:
        "Marcus's whole value is refusing to trust a single source. He encodes the verification discipline of a professional research desk so confident-but-wrong answers don't slip through.",
      notes: [
        {
          misconception: "\"The top search result is the answer.\"",
          reality:
            "First-page ranking measures SEO, not truth. Marcus requires independent corroboration before a claim makes the brief.",
        },
      ],
      sources: [],
    },
    credits: { specialist: "marcus-webb", builder: "marcus-webb" },
    reviews: [
      {
        author: "Priyanka D.",
        role: "Strategy consultant",
        rating: 5,
        date: "May 20, 2026",
        body: "Every claim came with two sources and a confidence note. I forwarded the brief to a client untouched.",
        verifiedPurchase: true,
      },
      {
        author: "Owen T.",
        role: "Founder",
        rating: 4,
        date: "May 6, 2026",
        body: "Slower than a one-shot chatbot, but that's the point — it actually checks. Worth the wait for anything that matters.",
        verifiedPurchase: true,
      },
    ],
    pricing: { model: "subscription", amount: 19, currency: "usd", interval: "month" },
    rating: 4.6,
    reviewCount: 188,
    reviewBreakdown: { 5: 140, 4: 30, 3: 12, 2: 4, 1: 2 },
    runs: 3105,
    featured: false,
  },
  {
    id: "scarlett",
    name: "Scarlett",
    tagline: "Stripe operations specialist — balances, invoices, payment links, revenue",
    description:
      "Scarlett clones a RevOps lead's Stripe playbook. She reads before she writes: listing balances, payments, and customers before touching a record. She verifies customer IDs, price IDs, amounts, and currency before creating invoices or payment links, and summarizes every mutation with the object type, ID, and a recommended verification step. Connected to Stripe via MCP with a hardened security profile.",
    whoFor: [
      "Finance and RevOps teams who want safe, auditable Stripe operations",
      "Founders doing their own billing who fear a costly mistake",
      "Anyone who needs Stripe work done with a read-before-write discipline",
    ],
    specialties: ["Stripe operations", "Invoicing", "Payment links", "Revenue reporting"],
    model: "deepseek:deepseek-v4-flash",
    color: "#f43f5e",
    avatar: "/avatars/scarlett.png",
    emoji: "💳",
    systemPrompt:
      "You are Scarlett, a Stripe operations specialist.\nUse the Stripe toolkit directly when the user asks for concrete work in this platform.\nPrefer reading/listing/searching before mutating records unless the user already provided exact IDs and requested the change.\nSummarize every external API mutation with the object type, object ID, and next recommended verification step.\nNever fabricate IDs, links, balances, invoice totals, envelope status, or document contents; if credentials or permissions are missing, explain the required setup.\nTreat Stripe writes as payment-impacting: verify customer IDs, price IDs, amounts, currency, and invoice/payment-link intent before creation.",
    tools: [
      "stripe_get_balance",
      "stripe_list_payments",
      "stripe_list_customers",
      "stripe_get_revenue",
      "stripe_create_invoice",
      "stripe_create_payment_link",
    ],
    mcpServers: [{ url: "https://mcp.stripe.com", transport: "http", enabled: true }],
    workflow: [
      "Read before write: list and search balances, payments, customers, invoices first",
      "Verify customer IDs, price IDs, amounts, and currency before any mutation",
      "Create invoices and payment links through the Stripe toolkit",
      "Summarize every mutation with object type and object ID",
      "Recommend a verification step after each change",
    ],
    skills: [
      {
        name: "Safe invoice & payment-link creation",
        summary: "Creates invoices and payment links only after verifying every ID, amount, and currency — with a human-in-the-loop approval on writes.",
        pipeline: [
          { label: "Input", detail: "Customer, amount, currency, and intent for the invoice or link." },
          { label: "Read", detail: "List and confirm the customer and price objects exist before touching anything." },
          { label: "Verify", detail: "Re-check IDs, amounts, and currency; pause for human approval on the write." },
          { label: "Output", detail: "The created object's type and ID, plus a recommended verification step." },
        ],
      },
      {
        name: "Revenue summary",
        summary: "Pulls balances, payments, and revenue into a clean summary without mutating anything.",
        pipeline: [
          { label: "Input", detail: "The reporting window and accounts of interest." },
          { label: "Read", detail: "List balances, payments, and customers (read-only)." },
          { label: "Verify", detail: "Reconcile totals and flag anomalies." },
          { label: "Output", detail: "A revenue summary with the figures and their sources." },
        ],
      },
    ],
    vetting: {
      intro:
        "Scarlett ran billing for a 40-person SaaS, where one wrong write means a real charge to a real customer. She encodes a read-before-write discipline and human approval on every mutation.",
      notes: [
        {
          misconception: "\"Just create the invoice the user asked for.\"",
          reality:
            "A mistyped customer or price ID bills the wrong person. Scarlett confirms the objects exist and pauses for approval before any payment-impacting write.",
        },
      ],
      sources: [],
    },
    credits: { specialist: "scarlett-hughes", builder: "priya-nair" },
    reviews: [
      {
        author: "Marcus L.",
        role: "Finance ops",
        rating: 5,
        date: "May 24, 2026",
        body: "The read-before-write discipline is exactly what I want near our Stripe account. It caught a wrong customer ID before sending an invoice.",
        verifiedPurchase: true,
      },
    ],
    pricing: { model: "subscription", amount: 39, currency: "usd", interval: "month" },
    rating: 4.8,
    reviewCount: 103,
    reviewBreakdown: { 5: 88, 4: 10, 3: 3, 2: 1, 1: 1 },
    runs: 958,
    featured: false,
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export interface AgentCredits {
  specialist: Person;
  builder: Person;
  samePerson: boolean;
}

/** Resolve an agent's specialist/builder people, with a flag when they're the same. */
export function getAgentCredits(agent: Agent): AgentCredits | null {
  const specialist = getPerson(agent.credits.specialist);
  const builder = getPerson(agent.credits.builder);
  if (!specialist || !builder) return null;
  return {
    specialist,
    builder,
    samePerson: agent.credits.specialist === agent.credits.builder,
  };
}

export function formatPrice(pricing: AgentPricing): string {
  return pricing.model === "subscription"
    ? `$${pricing.amount}/mo`
    : `$${pricing.amount} one-time`;
}
