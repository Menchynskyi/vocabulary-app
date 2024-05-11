"use client";

import { cn } from "@/utils/tailwind";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/Sheet";
import { Button } from "./ui/Button";
import { BarChart3, Layers3, Menu, Wand } from "lucide-react";
import { NotionIcon } from "./icons/NotionIcon";
import { useState } from "react";
import { SignedIn } from "@clerk/nextjs";

export function MobileNavigation() {
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Sheet open={isOpened} onOpenChange={(open) => setIsOpened(open)}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="flex md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-[55vw]">
        <div className="flex flex-col gap-4 pt-5">
          <div className="flex items-center gap-1">
            <div className="w-10 pl-3.5">
              <NotionIcon className="h-5 w-5 transition-all" />
            </div>
            <a
              aria-label="Notion page"
              href={process.env.NEXT_PUBLIC_NOTION_PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-md text-muted-foreground transition-colors hover:text-muted-foreground/60"
            >
              Notion
            </a>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-10 pl-4">
              <Layers3 className="mr-2 h-4 w-4" />
            </div>
            <Link
              href="/"
              aria-label="Cards page"
              onClick={() => setIsOpened(false)}
              className={cn(
                "text-md text-muted-foreground transition-colors hover:text-muted-foreground/60",
                {
                  "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
                    pathname === "/" || pathname.startsWith("/edit-card"),
                },
              )}
            >
              Cards
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-10 pl-4">
              <Wand className="mr-2 h-4 w-4" />
            </div>
            <Link
              href="/blanks"
              aria-label="Blanks page"
              onClick={() => setIsOpened(false)}
              className={cn(
                "text-md text-muted-foreground transition-colors hover:text-muted-foreground/60",
                {
                  "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
                    pathname.startsWith("/blanks"),
                },
              )}
            >
              Blanks
            </Link>
          </div>
          <SignedIn>
            <div className="flex items-center gap-1">
              <div className="w-10 pl-4">
                <BarChart3 className="mr-2 h-4 w-4" />
              </div>
              <Link
                href="/stats"
                aria-label="Stats page"
                onClick={() => setIsOpened(false)}
                className={cn(
                  "text-md text-muted-foreground transition-colors hover:text-muted-foreground/60",
                  {
                    "text-foreground hover:text-foreground/60 max-sm:hover:text-foreground":
                      pathname === "/stats",
                  },
                )}
              >
                Stats
              </Link>
            </div>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
}
