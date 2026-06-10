/**
 * Currencies the checkout offers. Switching currency is what surfaces local
 * payment methods in Stripe Checkout (dynamic payment methods): e.g. SGD shows
 * PayNow on one-time payments, EUR shows Bancontact, etc. Cards work in every
 * currency, so international card payments are always available.
 *
 * For the demo the numeric price is reused across currencies (no FX applied).
 * All listed currencies are 2-decimal, so minor units = amount * 100.
 */
export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
  flag: string;
  /** Local method highlighted for this market (shown as a hint). */
  localMethod?: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "sgd", label: "SGD", symbol: "S$", flag: "🇸🇬", localMethod: "PayNow" },
  { code: "usd", label: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "eur", label: "EUR", symbol: "€", flag: "🇪🇺", localMethod: "Bancontact" },
  { code: "gbp", label: "GBP", symbol: "£", flag: "🇬🇧" },
  { code: "aud", label: "AUD", symbol: "A$", flag: "🇦🇺" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

/** Singapore account → SGD default so PayNow is one click away. */
export const DEFAULT_CURRENCY = "sgd";

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}
