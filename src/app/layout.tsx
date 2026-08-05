import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Inter, Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { isLocale, defaultLocale } from "@/i18n/config";
import { isCurrencyCode, defaultCurrency } from "@/lib/currency";
import "./globals.css";

const displaySans = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodySans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayHe = Frank_Ruhl_Libre({
  variable: "--font-display-he",
  subsets: ["hebrew"],
  weight: ["400", "500", "700"],
});

const bodyHe = Heebo({
  variable: "--font-body-he",
  subsets: ["hebrew"],
});

export const metadata: Metadata = {
  title: {
    default: "Studio Gallery — Original Art & Fine Art Prints",
    template: "%s | Studio Gallery",
  },
  description:
    "An exclusive online art gallery offering original paintings and museum-quality fine art prints, shipped worldwide.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;

  const currencyCookie = cookieStore.get("NEXT_CURRENCY")?.value;
  const currency = isCurrencyCode(currencyCookie) ? currencyCookie : defaultCurrency;

  return (
    <html
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
      className={`${displaySans.variable} ${bodySans.variable} ${displayHe.variable} ${bodyHe.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthSessionProvider>
          <LocaleProvider initialLocale={locale}>
            <CurrencyProvider initialCurrency={currency}>{children}</CurrencyProvider>
          </LocaleProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
