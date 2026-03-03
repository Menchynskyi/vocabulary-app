import { Skeleton } from "@/components/ui/Skeleton";

export function StatsSkeleton() {
  return (
    <div className="space-y-4 p-5 pt-2">
      <div>
        <Skeleton className="h-[200px] rounded-md" />
      </div>
      <div className="flex justify-between gap-2">
        <Skeleton className="h-10 w-full min-w-32" />
        <Skeleton className="h-10 w-full min-w-32" />
      </div>
    </div>
  );
}
