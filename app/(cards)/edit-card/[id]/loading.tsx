import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-12" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-12" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-12" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-12" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
