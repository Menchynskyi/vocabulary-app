"use client";

import { ErrorMessage } from "@/components/ErrorMessage";

export default function Error() {
  const handleRetry = () => {
    if (typeof window === "undefined") return;
    window.location.reload();
  };
  return <ErrorMessage retry={handleRetry} />;
}
