import { Skeleton } from "@/components/ui/Skeleton";

type ContextSkeletonProps = {
  wordsCount?: number;
};

export function ContextSkeleton({ wordsCount = 3 }: ContextSkeletonProps) {
  return (
    <div className="mx-4 mt-6 w-full max-w-4xl rounded-md border p-4 sm:mt-8 sm:p-6">
      <div className="space-y-4">
        {Array.from({ length: wordsCount }).map((_, index) => (
          <div key={index} className="rounded-md border p-4">
            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="mt-3 h-10 w-full" />
            <Skeleton className="mt-2 h-4 w-40" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
