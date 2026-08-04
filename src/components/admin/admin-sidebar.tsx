"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  ShoppingCart,
  Tags,
  Palette,
  Users,
  Mail,
  MessageSquare,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/mediums", label: "Mediums", icon: Palette },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navItems.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-foreground text-background" : "text-foreground/80 hover:bg-secondary"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-border bg-secondary/40 px-4 lg:hidden">
        <Link href="/admin" className="font-display text-lg">
          Studio Admin
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open admin menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background p-0">
            <SheetTitle className="px-6 pt-6 font-display text-lg">Studio Admin</SheetTitle>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="border-t border-border p-3">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
              >
                &larr; Back to Store
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden w-60 shrink-0 border-e border-border bg-secondary/40 lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-display text-lg">
            Studio Admin
          </Link>
        </div>
        <NavList pathname={pathname} />
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            &larr; Back to Store
          </Link>
        </div>
      </aside>
    </>
  );
}
