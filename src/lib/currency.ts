export type CurrencyCode = "USD" | "ILS" | "EUR" | "GBP" | "CAD" | "AUD";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /**
   * Static placeholder rate (units of this currency per 1 USD). All prices
   * in the catalog/DB are stored in USD; this is used purely for display
   * conversion. Replace with a live FX provider before launch — these
   * numbers will drift out of date otherwise.
   */
  rateToUsd: number;
};

export const currencies: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "US Dollar", rateToUsd: 1 },
  { code: "ILS", symbol: "₪", label: "Israeli Shekel", rateToUsd: 3.7 },
  { code: "EUR", symbol: "€", label: "Euro", rateToUsd: 0.92 },
  { code: "GBP", symbol: "£", label: "British Pound", rateToUsd: 0.79 },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar", rateToUsd: 1.37 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", rateToUsd: 1.52 },
];

export const defaultCurrency: CurrencyCode = "USD";

export function isCurrencyCode(value: string | undefined): value is CurrencyCode {
  return currencies.some((c) => c.code === value);
}

export function getCurrency(code: CurrencyCode): CurrencyInfo {
  return currencies.find((c) => c.code === code) ?? currencies[0];
}

export function convertFromUsd(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * getCurrency(code).rateToUsd;
}

/**
 * Best-effort default currency from the browser's locale — a reasonable
 * substitute for IP geolocation until a geo-IP provider is wired up (that
 * has its own cost/privacy tradeoffs worth deciding separately).
 */
export function detectCurrencyFromLocale(locale: string): CurrencyCode {
  const region = locale.split("-")[1]?.toUpperCase();
  switch (region) {
    case "IL":
      return "ILS";
    case "GB":
      return "GBP";
    case "CA":
      return "CAD";
    case "AU":
      return "AUD";
    case "AT":
    case "BE":
    case "DE":
    case "ES":
    case "FR":
    case "IT":
    case "NL":
    case "PT":
    case "IE":
    case "FI":
    case "GR":
      return "EUR";
    default:
      return "USD";
  }
}
