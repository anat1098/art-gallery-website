"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/components/providers/locale-provider";

export function AccountMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User className="size-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "authenticated" ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/account">{t.account.myAccount}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/orders">{t.account.orders}</Link>
            </DropdownMenuItem>
            {session?.user.role === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">{t.account.adminPanel}</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
                router.refresh();
              }}
            >
              {t.account.logOut}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">{t.account.login}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">{t.account.registerNav}</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
