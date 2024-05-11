import { getUserBlanksStats } from "@/server/db/queries";
import { AccuracyChart } from "./_components/AccuracyChart";
import { Suspense } from "react";
import { StatsSkeleton } from "./_components/StatsSkeleton";
import { redirect } from "next/navigation";

type StatsProps = {
  searchParams: {
    page?: number;
  };
};

export default async function Stats({ searchParams }: StatsProps) {
  const page = Number(searchParams.page ?? 1);

  if (isNaN(page) || page <= 0) {
    redirect("/stats?page=1");
  }

  const { data, totalPages } = await getUserBlanksStats(page > 0 ? page : 1);

  if (page > totalPages && totalPages !== 0) {
    redirect(`/stats?page=${totalPages}`);
  }

  return (
    <div className="flex w-full justify-center">
      <div className="my-auto w-[90vw] max-w-[1200px] rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Blanks accuracy
          </h2>
          <p className="text-sm text-muted-foreground">
            Your average accuracy across all blanks
          </p>
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <AccuracyChart data={data} pagination={{ page, totalPages }} />
        </Suspense>
      </div>
    </div>
  );
}
