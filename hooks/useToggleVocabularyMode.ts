import { useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { VocabularyMode } from "@/types";
import { getNextVocabularyMode } from "@/utils/getNextVocabularyMode";

export function useToggleVocabularyMode() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isToggleModePending, startTransition] = useTransition();
  const pendingToggleModeResolveRef = useRef<(() => void) | null>(null);

  const toggleVocabularyMode = () => {
    const params = new URLSearchParams(searchParams);
    const currentMode = params.get("mode") as VocabularyMode;
    const newMode = getNextVocabularyMode(currentMode);

    const promise = new Promise<string>((resolve) => {
      pendingToggleModeResolveRef.current = () => resolve(newMode);
    });

    toast.promise(promise, {
      loading: "Toggling vocabulary mode...",
      success: (mode) => `Toggled to ${mode} mode`,
      error: "Failed to toggle mode",
    });

    startTransition(() => {
      replace(`${pathname}?mode=${newMode}`);
    });
  };

  useEffect(() => {
    if (!isToggleModePending && pendingToggleModeResolveRef.current) {
      pendingToggleModeResolveRef.current();
      pendingToggleModeResolveRef.current = null;
    }
  }, [isToggleModePending]);

  return { toggleVocabularyMode, searchParams };
}
