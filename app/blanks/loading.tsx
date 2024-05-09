import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mt-6 w-[90vw] rounded-md border bg-background p-4 sm:mt-8 sm:w-[500px] sm:px-10">
      <div className="py-1">
        <Skeleton className="h-10 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-6 w-48 rounded-md" />
      <div className="mt-10 flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
