"use client";

import { cn } from "@/utils/tailwind";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="ml-4 mr-auto flex items-center">
      <Link
        href="/"
        aria-label="Cards page"
        className={cn(
          "text-sm text-muted-foreground transition-colors hover:text-muted-foreground/60",
          {
            "text-foreground hover:text-foreground/60": pathname === "/",
          },
        )}
      >
        Cards
      </Link>
      <Link
        href="/blanks"
        aria-label="Blanks page"
        className={cn(
          "ml-3 text-sm text-muted-foreground transition-colors hover:text-muted-foreground/60",
          {
            "text-foreground hover:text-foreground/60": pathname === "/blanks",
          },
        )}
      >
        Blanks
      </Link>
    </nav>
  );
}
