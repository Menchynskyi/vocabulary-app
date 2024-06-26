import { Skeleton } from "@/components/ui/Skeleton";

export function CardsSkeleton() {
  return (
    <div className="mt-16 flex flex-col items-center sm:mt-36 sm:flex-row">
      <Skeleton className="mb-[45px] mr-4 hidden h-10 w-10 rounded-full sm:flex" />
      <Skeleton className="h-[400px] w-[90vw] sm:w-[400px]" />
      <Skeleton className="mb-[45px] ml-4 hidden h-10 w-10 rounded-full sm:flex" />
      <div className="mt-10 flex w-full justify-between sm:hidden">
        <Skeleton className="h-16 w-16" />
        <Skeleton className="h-16 w-16" />
      </div>
    </div>
  );
}
