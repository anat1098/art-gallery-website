"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  convertFromUsd,
  detectCurrencyFromLocale,
  getCurrency,
  type CurrencyCode,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Formats a USD-denominated amount in the visitor's selected currency. */
  format: (amountUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: CurrencyCode;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);
  const hasStoredPreference = useRef(
    typeof document !== "undefined" && document.cookie.includes("NEXT_CURRENCY=")
  );

  useEffect(() => {
    if (hasStoredPreference.current) return;
    const detected = detectCurrencyFromLocale(navigator.language);
    if (detected !== currency) setCurrencyState(detected);
    // Only auto-detect once, on first mount, when no explicit preference exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next);
    hasStoredPreference.current = true;
    document.cookie = `NEXT_CURRENCY=${next}; path=/; max-age=31536000`;
  }

  function format(amountUsd: number) {
    const converted = convertFromUsd(amountUsd, currency);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(converted);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { getCurrency };
