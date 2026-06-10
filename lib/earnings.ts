import { agents, type PricingModel } from "./agents";
import { getPerson } from "./people";

/** Project Mural's marketplace take-rate on every sale. */
export const PLATFORM_TAKE = 0.2;

export interface EarningLine {
  agentId: string;
  agentName: string;
  role: string;
  model: PricingModel;
  amount: number;
}

export interface CreatorEarnings {
  currency: string;
  lifetime: number;
  available: number;
  pending: number;
  lines: EarningLine[];
}

/**
 * Demo earnings for a creator. Units sold are proxied by reviewCount; each
 * sale splits 80% to the creator pool / 20% platform take. When the specialist
 * and builder differ they share the pool 70/30; one person who did both keeps
 * it all. Figures are in SGD to match the Stripe (SG) payout account.
 */
export function getCreatorEarnings(slug: string): CreatorEarnings | null {
  const person = getPerson(slug);
  if (!person) return null;

  const lines: EarningLine[] = [];
  for (const a of agents) {
    const isSpecialist = a.credits.specialist === slug;
    const isBuilder = a.credits.builder === slug;
    if (!isSpecialist && !isBuilder) continue;

    const units = a.reviewCount;
    const pool = a.pricing.amount * units * (1 - PLATFORM_TAKE);
    const same = a.credits.specialist === a.credits.builder;

    let share: number;
    let role: string;
    if (same) {
      share = 1;
      role = "Specialist & builder";
    } else if (isSpecialist) {
      share = 0.7;
      role = "Specialist";
    } else {
      share = 0.3;
      role = "Builder";
    }

    lines.push({
      agentId: a.id,
      agentName: a.name,
      role,
      model: a.pricing.model,
      amount: Math.round(pool * share),
    });
  }

  const lifetime = lines.reduce((sum, l) => sum + l.amount, 0);
  const available = Math.round(lifetime * 0.86);
  const pending = lifetime - available;
  return { currency: "sgd", lifetime, available, pending, lines };
}

export function formatSGD(amount: number): string {
  return `S$${amount.toLocaleString("en-SG")}`;
}
