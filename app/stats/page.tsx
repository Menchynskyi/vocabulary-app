import {
  getUserBlanksStats,
  getUserCardsDailyWords,
  getUserContextStats,
  getUserGamesMonthlyUsageByYear,
  getUserGamesUsageYears,
  getUserMatchUpStats,
} from "@/server/db/queries";
import { BlanksAccuracyChart } from "./_components/BlanksAccuracyChart";
import { Suspense } from "react";
import { StatsSkeleton } from "./_components/StatsSkeleton";
import { redirect } from "next/navigation";
import { CardsDailyBarChart } from "./_components/CardsDailyBarChart";
import { MatchUpAccuracyChart } from "./_components/MatchUpAccuracyChart";
import { GamesPopularityRadarChart } from "./_components/GamesPopularityRadarChart";
import { ContextAccuracyChart } from "./_components/ContextAccuracyChart";

type StatsProps = {
  searchParams: {
    cardsPage?: string;
    matchUpPage?: string;
    blanksPage?: string;
    contextPage?: string;
    gamesYear?: string;
  };
};

const getClosestYear = (year: number, availableYears: number[]) => {
  if (availableYears.includes(year)) {
    return year;
  }

  return availableYears.reduce((closest, current) =>
    Math.abs(current - year) < Math.abs(closest - year) ? current : closest,
  );
};

export default async function Stats({ searchParams }: StatsProps) {
  const parsePositiveInt = (value: string | undefined, fallback = 1) => {
    const parsed = Number(value ?? fallback);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  };

  const cardsPage = parsePositiveInt(searchParams.cardsPage, 1);
  const matchUpPage = parsePositiveInt(searchParams.matchUpPage, 1);
  const blanksPage = parsePositiveInt(searchParams.blanksPage, 1);
  const contextPage = parsePositiveInt(searchParams.contextPage, 1);
  const currentYear = new Date().getFullYear();
  const gamesYear = parsePositiveInt(searchParams.gamesYear, currentYear);

  const [
    cardsDailyWords,
    matchUpStats,
    blanksStats,
    contextStats,
    availableYears,
  ] = await Promise.all([
    getUserCardsDailyWords(cardsPage, 20),
    getUserMatchUpStats(matchUpPage, 20),
    getUserBlanksStats(blanksPage),
    getUserContextStats(contextPage),
    getUserGamesUsageYears(),
  ]);

  const safeGamesYear = getClosestYear(gamesYear, availableYears);
  if (safeGamesYear !== gamesYear) {
    redirect(
      `/stats?cardsPage=${cardsPage}&matchUpPage=${matchUpPage}&blanksPage=${blanksPage}&contextPage=${contextPage}&gamesYear=${safeGamesYear}`,
    );
  }

  const gamesMonthlyUsage = await getUserGamesMonthlyUsageByYear(safeGamesYear);
  const currentYearIndex = availableYears.indexOf(safeGamesYear);
  const previousYear =
    currentYearIndex > 0 ? availableYears[currentYearIndex - 1] : null;
  const nextYear =
    currentYearIndex >= 0 && currentYearIndex < availableYears.length - 1
      ? availableYears[currentYearIndex + 1]
      : null;

  if (
    cardsPage > cardsDailyWords.totalPages &&
    cardsDailyWords.totalPages !== 0
  ) {
    redirect(
      `/stats?cardsPage=${cardsDailyWords.totalPages}&matchUpPage=${matchUpPage}&blanksPage=${blanksPage}&contextPage=${contextPage}&gamesYear=${safeGamesYear}`,
    );
  }

  if (matchUpPage > matchUpStats.totalPages && matchUpStats.totalPages !== 0) {
    redirect(
      `/stats?cardsPage=${cardsPage}&matchUpPage=${matchUpStats.totalPages}&blanksPage=${blanksPage}&contextPage=${contextPage}&gamesYear=${safeGamesYear}`,
    );
  }

  if (blanksPage > blanksStats.totalPages && blanksStats.totalPages !== 0) {
    redirect(
      `/stats?cardsPage=${cardsPage}&matchUpPage=${matchUpPage}&blanksPage=${blanksStats.totalPages}&contextPage=${contextPage}&gamesYear=${safeGamesYear}`,
    );
  }

  if (contextPage > contextStats.totalPages && contextStats.totalPages !== 0) {
    redirect(
      `/stats?cardsPage=${cardsPage}&matchUpPage=${matchUpPage}&blanksPage=${blanksPage}&contextPage=${contextStats.totalPages}&gamesYear=${safeGamesYear}`,
    );
  }

  return (
    <div className="mx-auto flex w-[90vw] max-w-[1200px] flex-col gap-4 pb-6 pt-0">
      <div className="rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Cards per day
          </h2>
          <p className="text-sm text-muted-foreground">
            How many words you completed on each day
          </p>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <CardsDailyBarChart
            data={cardsDailyWords.data}
            pagination={{
              page: cardsPage,
              totalPages: cardsDailyWords.totalPages,
            }}
          />
        </Suspense>
      </div>

      <div className="rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Match up accuracy
          </h2>
          <p className="text-sm text-muted-foreground">
            Accuracy for recent attempts based on mistakes made
          </p>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <MatchUpAccuracyChart
            data={matchUpStats.data}
            pagination={{
              page: matchUpPage,
              totalPages: matchUpStats.totalPages,
            }}
          />
        </Suspense>
      </div>

      <div className="rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Blanks accuracy
          </h2>
          <p className="text-sm text-muted-foreground">
            Your average accuracy across all blanks
          </p>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <BlanksAccuracyChart
            data={blanksStats.data}
            pagination={{
              page: blanksPage,
              totalPages: blanksStats.totalPages,
            }}
            pageParamKey="blanksPage"
          />
        </Suspense>
      </div>

      <div className="rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Context accuracy
          </h2>
          <p className="text-sm text-muted-foreground">
            Your average accuracy across all context rounds
          </p>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <ContextAccuracyChart
            data={contextStats.data}
            pagination={{
              page: contextPage,
              totalPages: contextStats.totalPages,
            }}
            pageParamKey="contextPage"
          />
        </Suspense>
      </div>

      <div className="rounded-md border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Most popular game by month
          </h2>
          <p className="text-sm text-muted-foreground">
            Record counts for cards, match-up, blanks, and context in the
            current year
          </p>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <GamesPopularityRadarChart
            data={gamesMonthlyUsage}
            year={safeGamesYear}
            previousYear={previousYear}
            nextYear={nextYear}
          />
        </Suspense>
      </div>
    </div>
  );
}
