"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { mainNav } from "@/lib/constants/nav";
import { useCartCount } from "@/hooks/use-cart-store";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";
import { SiteSearch } from "@/components/shared/site-search";
import { AccountMenu } from "@/components/shared/account-menu";
import { useLocale } from "@/components/providers/locale-provider";

export function SiteHeader({ storeName }: { storeName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartCount();
  const { locale } = useLocale();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "he" ? "right" : "left"} className="w-72 bg-background">
              <SheetTitle className="px-6 pt-6 font-display text-xl">
                {storeName}
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-1 px-6">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-3 text-base text-foreground/90 hover:bg-secondary"
                  >
                    {locale === "he" ? item.labelHe : item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-4 border-t border-border px-6 pt-6">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="font-display text-xl tracking-wide lg:text-2xl">
          {storeName}
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === "he" ? item.labelHe : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher compact />
            <CurrencySwitcher compact />
          </div>
          <SiteSearch />
          <AccountMenu />
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="size-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] text-brand-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
