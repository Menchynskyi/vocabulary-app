"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/utils/dates";

type CardsDailyBarChartProps = {
  data: Array<{
    date: Date;
    wordsCompleted: number;
  }>;
  pagination: {
    page: number;
    totalPages: number;
  };
  pageParamKey?: string;
};

export function CardsDailyBarChart({
  data,
  pagination,
  pageParamKey = "cardsPage",
}: CardsDailyBarChartProps) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChangePage = (inc: number) => () => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParamKey, `${Number(params.get(pageParamKey) || 1) + inc}`);
    startTransition(() => {
      push(`/stats?${params.toString()}`);
    });
  };

  if (data.length === 0) {
    return (
      <div className="justify-center p-6 pt-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Start cards sessions to see your daily progress here
        </Link>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0]?.payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {formatDate(point.date)}
                        </span>
                        <span className="font-bold">
                          {point.wordsCompleted} words
                        </span>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(value: Date) => formatDate(new Date(value))}
              minTickGap={20}
            />
            <YAxis allowDecimals={false} />
            <Bar
              dataKey="wordsCompleted"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between gap-2 px-4 pb-4 pt-2">
        <Button
          variant="outline"
          onClick={handleChangePage(1)}
          className="w-full min-w-32 sm:w-auto"
          disabled={pagination.page === pagination.totalPages || isPending}
        >
          {isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <MoveLeft className="mr-2 h-4 w-4" />
          )}
          Earlier
        </Button>
        <Button
          variant="outline"
          onClick={handleChangePage(-1)}
          disabled={pagination.page === 1 || isPending}
          className="w-full min-w-32 sm:w-auto"
        >
          Later
          {isPending ? (
            <Spinner className="ml-2 h-4 w-4" />
          ) : (
            <MoveRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
