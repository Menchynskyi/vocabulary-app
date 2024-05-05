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

export function UserProfileButton() {
  const { isLoaded } = useUser();

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
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
