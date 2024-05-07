"use client";

import { ErrorMessage } from "@/components/ErrorMessage";

export default function Error() {
  const handleRetry = () => {
    if (typeof window === "undefined") return;
    window.location.reload();
  };
  return <ErrorMessage className="mt-16 sm:mt-36" retry={handleRetry} />;
}
