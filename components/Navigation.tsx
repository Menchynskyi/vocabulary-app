"use client";

import { cn } from "@/utils/tailwind";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navigation";

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="ml-4 mr-auto hidden items-center md:flex">
      {navLinks.map((link, index) => {
        const isActive = link.isActive
          ? link.isActive(pathname)
          : pathname.startsWith(link.path);

        const element = (
          <Link
            key={link.path}
            href={link.path}
            aria-label={`${link.label} page`}
            className={cn(
              "text-sm text-muted-foreground transition-colors hover:text-muted-foreground/60",
              {
                "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
                  isActive,
                "ml-3": index > 0,
              },
            )}
          >
            {link.label}
          </Link>
        );

        return link.authGated ? (
          <SignedIn key={link.path}>{element}</SignedIn>
        ) : (
          element
        );
      })}
    </nav>
  );
}
