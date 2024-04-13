import { Suspense } from "react";
import { Cards as CardsView } from "./components/Cards";
import { DateRangeMode } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type CardsProps = {
  searchParams: {
    mode: DateRangeMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  return (
    <main className="mt-16 flex justify-center sm:mt-36">
      <Suspense
        fallback={<Skeleton className="h-[400px] w-[90vw] sm:w-[400px]" />}
      >
        <CardsView dateRangeMode={searchParams?.mode} />
      </Suspense>
    </main>
  );
}
