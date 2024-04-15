import { Suspense } from "react";
import { Cards as CardsView } from "./_components/Cards";
import { DateRangeMode } from "@/types";
import { CardsSkeleton } from "./_components/CardsSkeleton";

type CardsProps = {
  searchParams: {
    mode: DateRangeMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  return (
    <main className="mt-16 flex justify-center sm:mt-36">
      <Suspense fallback={<CardsSkeleton />}>
        <CardsView dateRangeMode={searchParams?.mode} />
      </Suspense>
    </main>
  );
}
