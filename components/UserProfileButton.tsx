"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/Button";
import { LogIn } from "lucide-react";
import { Skeleton } from "./ui/Skeleton";
import { useEffect } from "react";

export function UserProfileButton() {
  const { isLoaded } = useUser();

  useEffect(() => {
    const checkPopover = () => {
      const popover = document.querySelector(".cl-userButton-popover");

      if (popover) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };

    checkPopover();

    const observer = new MutationObserver(checkPopover);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-10 w-10 items-center justify-center">
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="icon" variant="ghost">
            <LogIn className="h-4 w-4" />
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex h-10 w-10 items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                rootBox: "border-0 w-10",
                userButtonPopoverCard: "!fixed",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
