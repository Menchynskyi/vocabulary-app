import { Skeleton } from "@/components/ui/Skeleton";

export function StatsSkeleton() {
  return (
    <>
      <div className="p-5">
        <Skeleton className="h-[160px] rounded-md" />
      </div>
      <div className="flex justify-between gap-2 p-6">
        <Skeleton className="h-10 w-full min-w-32 sm:w-auto" />
        <Skeleton className="h-10 w-full min-w-32 sm:w-auto" />
      </div>
    </>
  );
}
