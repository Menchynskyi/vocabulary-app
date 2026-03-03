"use client";

import { Button } from "@/components/ui/Button";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type GamesPopularityRadarChartProps = {
  data: Array<{
    month: string;
    cards: number;
    matchUp: number;
    blanks: number;
    context: number;
  }>;
  year: number;
  previousYear: number | null;
  nextYear: number | null;
  yearParamKey?: string;
};

export function GamesPopularityRadarChart({
  data,
  year,
  previousYear,
  nextYear,
  yearParamKey = "gamesYear",
}: GamesPopularityRadarChartProps) {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handleChangeYear = (targetYear: number | null) => () => {
    if (!targetYear) return;
    const params = new URLSearchParams(searchParams);
    params.set(yearParamKey, `${targetYear}`);
    push(`/stats?${params.toString()}`);
  };

  const hasAnyRecords = data.some(
    (item) =>
      item.cards > 0 || item.matchUp > 0 || item.blanks > 0 || item.context > 0,
  );

  if (!hasAnyRecords) {
    return (
      <div className="justify-center p-6 pt-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Play cards, match-up, blanks, or context to compare monthly popularity
        </Link>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const cards = payload.find(
                    (item) => item.dataKey === "cards",
                  );
                  const matchUp = payload.find(
                    (item) => item.dataKey === "matchUp",
                  );
                  const blanks = payload.find(
                    (item) => item.dataKey === "blanks",
                  );
                  const context = payload.find(
                    (item) => item.dataKey === "context",
                  );

                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="mb-1 text-[0.70rem] uppercase text-muted-foreground">
                        {label}
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            cards
                          </span>
                          <span className="font-bold">{cards?.value ?? 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            match-up
                          </span>
                          <span className="font-bold">
                            {matchUp?.value ?? 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            blanks
                          </span>
                          <span className="font-bold">
                            {blanks?.value ?? 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            context
                          </span>
                          <span className="font-bold">
                            {context?.value ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <PolarGrid />
            <PolarAngleAxis dataKey="month" />
            <Legend />
            <Radar
              name="Cards"
              dataKey="cards"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Radar
              name="Match up"
              dataKey="matchUp"
              stroke="hsl(var(--secondary-foreground))"
              fill="hsl(var(--secondary-foreground))"
              fillOpacity={0.45}
            />
            <Radar
              name="Blanks"
              dataKey="blanks"
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.35}
            />
            <Radar
              name="Context"
              dataKey="context"
              stroke="hsl(262.1 83.3% 57.8%)"
              fill="hsl(262.1 83.3% 57.8%)"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 pb-2 pt-2 text-center text-sm text-muted-foreground">
        {year}
      </div>
      <div className="flex justify-between gap-2 px-4 pb-4">
        <Button
          variant="outline"
          onClick={handleChangeYear(previousYear)}
          disabled={!previousYear}
          className="w-full min-w-32 sm:w-auto"
        >
          <MoveLeft className="mr-2 h-4 w-4" />
          Previous year
        </Button>
        <Button
          variant="outline"
          onClick={handleChangeYear(nextYear)}
          disabled={!nextYear}
          className="w-full min-w-32 sm:w-auto"
        >
          Next year
          <MoveRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
