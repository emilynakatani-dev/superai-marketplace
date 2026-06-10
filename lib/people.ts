/**
 * People behind the agents. Every agent credits a SPECIALIST (the domain
 * expert whose judgment is being cloned — often non-technical) and a BUILDER
 * (who authored the agent on the harness). They are frequently the same
 * person. Profiles are linkable for verification (LinkedIn, site).
 */
export interface Person {
  slug: string;
  name: string;
  role: string;
  location?: string;
  bio: string;
  /** Marketplace identity check passed (ID + portfolio verified). */
  verified: boolean;
  linkedin?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  /** Accent color for the avatar bubble. */
  color: string;
  /** Slugs of agents this person is credited on. */
  agents: string[];
}

function linkedinSearch(name: string): string {
  return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
    name,
  )}`;
}

export const people: Record<string, Person> = {
  "yuki-tanaka": {
    slug: "yuki-tanaka",
    name: "Yuki Tanaka",
    role: "Aquaculture & product consultant",
    location: "Tokyo, Japan",
    bio: "15 years advising aquarium retailers, breeders, and product teams across Japan. Yuki does not write code — she packaged her customer-consult and fish-health diagnosis workflow into Emily with a builder, so the judgment she's spent a career refining can run without her in the room.",
    verified: true,
    linkedin: linkedinSearch("Yuki Tanaka aquaculture"),
    rating: 4.9,
    reviewCount: 132,
    color: "#f472b6",
    agents: ["emily"],
  },
  "kenji-sato": {
    slug: "kenji-sato",
    name: "Kenji Sato",
    role: "Agent builder, Project Mural",
    location: "Remote",
    bio: "Builds and ships specialist agents on Lionclaw and OpenClaw. Translated Yuki's hand-written diagnosis checklists into Emily's skills, memory, and verification pipeline — the engineering half of a non-technical expert's clone.",
    verified: true,
    linkedin: linkedinSearch("Kenji Sato agent engineer"),
    rating: 4.8,
    reviewCount: 41,
    color: "#38bdf8",
    agents: ["emily"],
  },
  "eugene-volkov": {
    slug: "eugene-volkov",
    name: "Eugene Volkov",
    role: "SEO & threat-intel consultant",
    location: "Berlin, Germany",
    bio: "Ten years of agency SEO, five in security research — and he codes. Eugene authored his own agent end to end, encoding the exact audit checklist (including the dark-web sweep clients used to wait weeks for) that he runs on real engagements.",
    verified: true,
    linkedin: linkedinSearch("Eugene Volkov SEO"),
    rating: 4.7,
    reviewCount: 98,
    color: "#60a5fa",
    agents: ["eugene"],
  },
  "carlos-mendoza": {
    slug: "carlos-mendoza",
    name: "Carlos Mendoza",
    role: "Fractional CTO — AI & web3",
    location: "Lisbon, Portugal",
    bio: "Former CTO of two funded startups, equally at home in a term sheet and a terminal. Carlos built his own agent, baking in the due-diligence checklist he uses on live engagements so founders get CTO-grade judgment on demand.",
    verified: true,
    linkedin: linkedinSearch("Carlos Mendoza CTO"),
    rating: 4.8,
    reviewCount: 74,
    color: "#d8508a",
    agents: ["carlos"],
  },
  "marcus-webb": {
    slug: "marcus-webb",
    name: "Marcus Webb",
    role: "Research analyst",
    location: "London, UK",
    bio: "Built research desks at two consultancies and writes his own tooling. Marcus encoded his source-verification pipeline into an agent so every answer is cross-checked and cited — no single-source shortcuts.",
    verified: true,
    linkedin: linkedinSearch("Marcus Webb research analyst"),
    rating: 4.6,
    reviewCount: 61,
    color: "#5b8def",
    agents: ["marcus"],
  },
  "scarlett-hughes": {
    slug: "scarlett-hughes",
    name: "Scarlett Hughes",
    role: "RevOps & payments lead",
    location: "Austin, USA",
    bio: "Ran billing operations for a 40-person SaaS. Scarlett defined the read-before-write Stripe discipline her team lived by; the agent enforces it on every run.",
    verified: true,
    linkedin: linkedinSearch("Scarlett Hughes RevOps"),
    rating: 4.8,
    reviewCount: 87,
    color: "#f43f5e",
    agents: ["scarlett"],
  },
  "priya-nair": {
    slug: "priya-nair",
    name: "Priya Nair",
    role: "Integrations engineer, Project Mural",
    location: "Remote",
    bio: "Wires specialist workflows into live systems. Priya built Scarlett — connecting Scarlett Hughes' payments playbook to the Stripe MCP server with a hardened security profile and human-in-the-loop approvals.",
    verified: true,
    linkedin: linkedinSearch("Priya Nair integrations engineer"),
    rating: 4.7,
    reviewCount: 33,
    color: "#22d3ee",
    agents: ["scarlett"],
  },
};

export function getPerson(slug: string): Person | undefined {
  return people[slug];
}
