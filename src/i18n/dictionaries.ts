import en from "./dictionaries/en.json";
import he from "./dictionaries/he.json";
import type { Locale } from "./config";

export const dictionaries = { en, he } satisfies Record<Locale, typeof en>;

export type Dictionary = typeof en;
