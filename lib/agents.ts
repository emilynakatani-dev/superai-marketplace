export type PricingModel = "one_time" | "subscription";

export interface Creator {
  name: string;
  title: string;
  bio: string;
  rating: number;
  reviewCount: number;
  agentsPublished: number;
}

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

export interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  specialties: string[];
  model: string;
  /** Per-agent accent color used for avatar rings and chips */
  color: string;
  avatar: string;
  emoji: string;
  systemPrompt: string;
  tools: string[];
  mcpServers: McpServer[];
  /** The captured expert workflow — the steps the agent executes, not just a prompt */
  workflow: string[];
  creator: Creator;
  pricing: AgentPricing;
  rating: number;
  reviewCount: number;
  runs: number;
  featured: boolean;
}

export const agents: Agent[] = [
  {
    id: "emily",
    name: "Emily",
    tagline: "Aquaculture & product expert — bilingual JP/EN, with a 3D and gaming edge",
    description:
      "Emily is the cloned workflow of a Tokyo-based aquaculture and product consultant. She walks customers from goal to purchase plan: matching species and equipment against compatibility tables, checking Japanese supplier catalogs, and flagging the edge cases — regulated species, incompatible tankmates, shipping rules — that a generic model breezes past. She also advises on 3D product visualization and gaming integrations, and works natively in Japanese or English.",
    specialties: ["Aquaculture", "Product strategy", "Customer success", "3D & gaming", "日本語 / English"],
    model: "deepseek:deepseek-v4-flash",
    color: "#f472b6",
    avatar: "/avatars/emily.jpg",
    emoji: "🐠",
    systemPrompt:
      "fish expert, AI expert, JAPANESE, friendly, good vibes, loves anime, woman",
    tools: [],
    mcpServers: [],
    workflow: [
      "Clarify the customer's goal and constraints — budget, tank size, region, language (JP/EN)",
      "Match species and equipment against compatibility and water-parameter tables",
      "Check seasonal availability and Japanese supplier catalogs",
      "Flag edge cases: incompatible tankmates, regulated species, import and shipping rules",
      "Deliver a purchase plan, with 3D visualization or gaming tie-ins when relevant",
    ],
    creator: {
      name: "Yuki Tanaka",
      title: "Aquaculture & product consultant, Tokyo",
      bio: "15 years advising aquarium retailers and product teams across Japan. Packaged her customer-consult workflow into Emily so it can run while she sleeps.",
      rating: 4.9,
      reviewCount: 132,
      agentsPublished: 1,
    },
    pricing: { model: "one_time", amount: 49, currency: "usd" },
    rating: 4.9,
    reviewCount: 214,
    runs: 1284,
    featured: true,
  },
  {
    id: "eugene",
    name: "Eugene",
    tagline: "SEO expert with a security researcher's eye — from SERP to dark web",
    description:
      "Eugene clones the workflow of a senior SEO consultant who moonlights in threat intelligence. He runs full technical audits, maps keyword and SERP gaps against competitors, screens backlink profiles for toxic domains, and — the part generic models can't do — monitors dark-web and leak channels for brand or domain mentions. Every engagement ends in a prioritized 30-day action plan with measurable KPIs.",
    specialties: ["SEO audits", "SERP analysis", "Backlink screening", "Dark-web monitoring"],
    model: "deepseek:deepseek-v4-flash",
    color: "#60a5fa",
    avatar: "/avatars/eugene.jpg",
    emoji: "🕶️",
    systemPrompt: "seo expert, hacker, dark web",
    tools: [],
    mcpServers: [],
    workflow: [
      "Crawl and audit the site: structure, Core Web Vitals, index coverage",
      "Run keyword and SERP gap analysis against the top competitors",
      "Screen backlink quality and shortlist toxic domains for disavowal",
      "Monitor dark-web and leak channels for brand, domain, and credential mentions",
      "Deliver a prioritized 30-day action plan with measurable KPIs",
    ],
    creator: {
      name: "Eugene Volkov",
      title: "SEO & threat-intel consultant",
      bio: "Ten years of agency SEO, five in security research. Eugene the agent runs his exact audit checklist — including the dark-web sweep clients used to wait weeks for.",
      rating: 4.7,
      reviewCount: 98,
      agentsPublished: 1,
    },
    pricing: { model: "subscription", amount: 29, currency: "usd", interval: "month" },
    rating: 4.7,
    reviewCount: 156,
    runs: 2371,
    featured: true,
  },
  {
    id: "carlos",
    name: "Carlos",
    tagline: "Fractional CTO for AI and web3 — architecture, risk, and roadmap",
    description:
      "Carlos packages the judgment of a fractional CTO who has shipped both AI products and on-chain protocols. He scopes the technical problem, reviews your AI stack and chain selection, runs a security and cost checklist (audits, gas, infra), and makes the build-vs-buy calls founders usually pay a retainer for. Output is an investor-ready technical summary, not a wall of options.",
    specialties: ["AI architecture", "Web3 & blockchain", "CTO advisory", "Technical due diligence"],
    model: "deepseek:deepseek-v4-flash",
    color: "#d8508a",
    avatar: "/avatars/carlos.jpg",
    emoji: "🛠️",
    systemPrompt: "AI, web3, blockchain",
    tools: [],
    mcpServers: [],
    workflow: [
      "Scope the technical problem, constraints, and stage of the company",
      "Review architecture: AI stack, chain selection, smart-contract risk surface",
      "Run the security and cost checklist — audits, gas, infra, vendor lock-in",
      "Make explicit build-vs-buy recommendations with trade-offs",
      "Deliver an investor-ready technical summary and 90-day roadmap",
    ],
    creator: {
      name: "Carlos Mendoza",
      title: "Fractional CTO — AI & web3",
      bio: "Former CTO of two funded startups. Carlos the agent runs the same due-diligence checklist he uses on real engagements.",
      rating: 4.8,
      reviewCount: 74,
      agentsPublished: 1,
    },
    pricing: { model: "one_time", amount: 99, currency: "usd" },
    rating: 4.8,
    reviewCount: 91,
    runs: 642,
    featured: false,
  },
  {
    id: "marcus",
    name: "Marcus",
    tagline: "Deep web research on demand — Exa-powered, source-verified",
    description:
      "Marcus is a research analyst's retrieval workflow turned into an agent. He decomposes your question, fans out Exa searches across news, papers, and forums, cross-verifies claims across independent sources, and scores credibility before anything reaches you. The deliverable is a cited brief — never a single-source answer.",
    specialties: ["Web research", "Exa search", "Source verification", "Cited briefs"],
    model: "deepseek:deepseek-v4-flash",
    color: "#5b8def",
    avatar: "/avatars/marcus.png",
    emoji: "🔎",
    systemPrompt:
      "Exa agent, web search expert\n\nResponse clearly to the agents asking you questions using talk_to_agent",
    tools: [],
    mcpServers: [],
    workflow: [
      "Decompose the research question into independent sub-queries",
      "Fan out Exa searches across news, papers, and community sources",
      "Cross-verify every claim against at least two independent sources",
      "Score source credibility and flag conflicting evidence",
      "Deliver a cited brief with confidence levels per claim",
    ],
    creator: {
      name: "Marcus Webb",
      title: "Research analyst",
      bio: "Built research desks at two consultancies. Marcus the agent runs his verification pipeline on every question, no shortcuts.",
      rating: 4.6,
      reviewCount: 61,
      agentsPublished: 1,
    },
    pricing: { model: "subscription", amount: 19, currency: "usd", interval: "month" },
    rating: 4.6,
    reviewCount: 188,
    runs: 3105,
    featured: false,
  },
  {
    id: "scarlett",
    name: "Scarlett",
    tagline: "Stripe operations specialist — balances, invoices, payment links, revenue",
    description:
      "Scarlett clones a RevOps lead's Stripe playbook. She reads before she writes: listing balances, payments, and customers before touching a record. She verifies customer IDs, price IDs, amounts, and currency before creating invoices or payment links, and summarizes every mutation with the object type, ID, and a recommended verification step. Connected to Stripe via MCP with a hardened security profile.",
    specialties: ["Stripe operations", "Invoicing", "Payment links", "Revenue reporting"],
    model: "deepseek:deepseek-v4-flash",
    color: "#f43f5e",
    avatar: "/avatars/scarlett.png",
    emoji: "💳",
    systemPrompt:
      "You are StripeAgent, the built-in Lionclaw specialist for Stripe.\nUse the Stripe toolkit directly when the user asks for concrete work in this platform.\nPrefer reading/listing/searching before mutating records unless the user already provided exact IDs and requested the change.\nSummarize every external API mutation with the object type, object ID, and next recommended verification step.\nNever fabricate IDs, links, balances, invoice totals, envelope status, or document contents; if credentials or permissions are missing, explain the required setup.\nTreat Stripe writes as payment-impacting: verify customer IDs, price IDs, amounts, currency, and invoice/payment-link intent before creation.",
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
    creator: {
      name: "Scarlett Hughes",
      title: "RevOps & payments lead",
      bio: "Ran billing ops for a 40-person SaaS. Scarlett the agent enforces the same read-before-write discipline she drilled into her team.",
      rating: 4.8,
      reviewCount: 87,
      agentsPublished: 1,
    },
    pricing: { model: "subscription", amount: 39, currency: "usd", interval: "month" },
    rating: 4.8,
    reviewCount: 103,
    runs: 958,
    featured: false,
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function formatPrice(pricing: AgentPricing): string {
  return pricing.model === "subscription"
    ? `$${pricing.amount}/mo`
    : `$${pricing.amount} one-time`;
}
