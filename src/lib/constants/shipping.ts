export type ShippingRegion = "IL" | "US" | "EU" | "CA" | "AU" | "GB" | "ROW";

export type ShippingRuleData = {
  region: ShippingRegion;
  label: string;
  cost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
};

/**
 * Placeholder shipping rules, shaped like the future `ShippingRule` table.
 * Replace with `prisma.shippingRule.findMany()` once the admin dashboard can
 * manage these.
 */
export const shippingRules: ShippingRuleData[] = [
  { region: "IL", label: "Israel", cost: 25, estimatedDaysMin: 2, estimatedDaysMax: 4 },
  { region: "US", label: "United States", cost: 35, estimatedDaysMin: 5, estimatedDaysMax: 9 },
  { region: "CA", label: "Canada", cost: 40, estimatedDaysMin: 6, estimatedDaysMax: 10 },
  { region: "GB", label: "United Kingdom", cost: 35, estimatedDaysMin: 5, estimatedDaysMax: 9 },
  { region: "EU", label: "Europe", cost: 30, estimatedDaysMin: 5, estimatedDaysMax: 9 },
  { region: "AU", label: "Australia", cost: 45, estimatedDaysMin: 7, estimatedDaysMax: 12 },
  { region: "ROW", label: "Rest of World", cost: 55, estimatedDaysMin: 8, estimatedDaysMax: 16 },
];

const EU_COUNTRY_CODES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
];

export const countries: { code: string; name: string }[] = [
  { code: "IL", name: "Israel" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  ...EU_COUNTRY_CODES.map((code) => ({
    code,
    name: new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code,
  })),
  { code: "OTHER", name: "Other" },
];

function regionForCountry(countryCode: string): ShippingRegion {
  if (countryCode === "IL") return "IL";
  if (countryCode === "US") return "US";
  if (countryCode === "CA") return "CA";
  if (countryCode === "GB") return "GB";
  if (countryCode === "AU") return "AU";
  if (EU_COUNTRY_CODES.includes(countryCode)) return "EU";
  return "ROW";
}

export function getShippingRule(countryCode: string): ShippingRuleData {
  const region = regionForCountry(countryCode);
  return shippingRules.find((r) => r.region === region) ?? shippingRules[shippingRules.length - 1];
}
