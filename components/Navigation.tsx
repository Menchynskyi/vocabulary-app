"use client";

import { cn } from "@/utils/tailwind";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="ml-4 mr-auto hidden items-center md:flex">
      <Link
        href="/"
        aria-label="Cards page"
        className={cn(
          "text-sm text-muted-foreground transition-colors hover:text-muted-foreground/60",
          {
            "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
              pathname === "/" || pathname.startsWith("/edit-card"),
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
            "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
              pathname.startsWith("/blanks"),
          },
        )}
      >
        Blanks
      </Link>
      <SignedIn>
        <Link
          href="/stats"
          aria-label="Stats page"
          className={cn(
            "ml-3 text-sm text-muted-foreground transition-colors hover:text-muted-foreground/60",
            {
              "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
                pathname === "/stats",
            },
          )}
        >
          Stats
        </Link>
      </SignedIn>
    </nav>
  );
}
