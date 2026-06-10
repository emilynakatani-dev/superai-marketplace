/**
 * Currencies the checkout offers. Switching currency is what surfaces local
 * payment methods in Stripe Checkout (dynamic payment methods): e.g. SGD shows
 * PayNow on one-time payments, EUR shows Bancontact, etc. Cards work in every
 * currency, so international card payments are always available.
 *
 * Listing prices are in USD; each currency carries a fixed demo FX rate that
 * is applied at display time AND at checkout, so a $49 agent charges ≈S$66,
 * not S$49. All listed currencies are 2-decimal, so minor units = amount*100.
 */
export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
  flag: string;
  /** Units per 1 USD — fixed demo FX rate. */
  rate: number;
  /** Local method highlighted for this market (shown as a hint). */
  localMethod?: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "sgd", label: "SGD", symbol: "S$", flag: "🇸🇬", rate: 1.35, localMethod: "PayNow" },
  { code: "usd", label: "USD", symbol: "$", flag: "🇺🇸", rate: 1 },
  { code: "eur", label: "EUR", symbol: "€", flag: "🇪🇺", rate: 0.92, localMethod: "Bancontact" },
  { code: "gbp", label: "GBP", symbol: "£", flag: "🇬🇧", rate: 0.79 },
  { code: "aud", label: "AUD", symbol: "A$", flag: "🇦🇺", rate: 1.52 },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

/** Singapore account → SGD default so PayNow is one click away. */
export const DEFAULT_CURRENCY = "sgd";

export function getCurrency(code: string): CurrencyOption {
  return (
    CURRENCIES.find((c) => c.code === code) ??
    // Fail safe by NAME, not array position — reordering CURRENCIES must
    // not silently change which rate unknown codes convert with.
    CURRENCIES.find((c) => c.code === DEFAULT_CURRENCY) ??
    CURRENCIES[0]
  );
}

/** Convert a USD listing price into a whole-unit local price. */
export function convertFromUsd(amountUsd: number, code: string): number {
  return Math.max(1, Math.round(amountUsd * getCurrency(code).rate));
}
