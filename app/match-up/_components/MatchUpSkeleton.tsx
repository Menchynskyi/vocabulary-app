import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/tailwind";
import { defaultMatchUpWordsCount } from "@/constants/match-up";

type MatchUpSkeletonProps = {
  wordsCount?: number;
};

const skeletonWidths = [
  "w-16 sm:w-20",
  "w-28 sm:w-36",
  "w-20 sm:w-24",
  "w-32 sm:w-40",
  "w-24 sm:w-28",
  "w-36 sm:w-44",
  "w-16 sm:w-24",
  "w-40 sm:w-48",
] as const;

export function MatchUpSkeleton({
  wordsCount = defaultMatchUpWordsCount,
}: MatchUpSkeletonProps) {
  const blockCount = wordsCount * 2;
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6 px-4">
      <Skeleton className="h-5 w-48 rounded-md" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: blockCount }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-12 rounded-lg",
              skeletonWidths[i % skeletonWidths.length],
            )}
          />
        ))}
      </div>
    </div>
  );
}
