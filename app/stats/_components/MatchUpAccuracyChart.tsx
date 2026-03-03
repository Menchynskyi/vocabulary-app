"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { formatDate } from "@/utils/dates";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MatchUpAccuracyChartProps = {
  data: Array<{
    accuracy: number;
    mistakes: number;
    initialLives: number;
    createdAt: Date;
  }>;
  pagination: {
    page: number;
    totalPages: number;
  };
  pageParamKey?: string;
};

export function MatchUpAccuracyChart({
  data,
  pagination,
  pageParamKey = "matchUpPage",
}: MatchUpAccuracyChartProps) {
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
          href="/match-up"
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Start match-up attempts to see your accuracy here
        </Link>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0]?.payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {formatDate(point.createdAt)}
                          </span>
                          <span className="font-bold">
                            {Math.round(point.accuracy)}%
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            mistakes
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {point.mistakes} / {point.initialLives}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <XAxis
              dataKey="createdAt"
              tickFormatter={(value: Date) => formatDate(new Date(value))}
              minTickGap={20}
            />
            <YAxis domain={[0, 100]} />
            <Line
              type="monotone"
              dataKey="accuracy"
              strokeWidth={2}
              activeDot={{
                r: 8,
                style: { fill: "hsl(var(--primary))" },
              }}
              style={{
                stroke: "hsl(var(--primary))",
              }}
            />
          </LineChart>
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
