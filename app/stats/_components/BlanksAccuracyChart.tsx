"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/dates";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

type BlanksAccuracyChartProps = {
  data: Array<{
    accuracy: number;
    avgAccuracy: number;
    createdAt: Date;
  }>;
  pagination: {
    page: number;
    totalPages: number;
  };
};

export function BlanksAccuracyChart({
  data,
  pagination,
}: BlanksAccuracyChartProps) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const domain = useMemo(() => {
    const min = Math.min(...data.map((d) => d.avgAccuracy));
    const max = Math.max(...data.map((d) => d.avgAccuracy));
    return [Math.max(0, min - 5), Math.min(100, max + 5)];
  }, [data]);

  const handleChangePage = (inc: number) => () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${Number(params.get("page") || 1) + inc}`);
    startTransition(() => {
      push(`/stats?${params.toString()}`);
    });
  };

  if (data.length === 0) {
    return (
      <div className="justify-center p-6 pt-2">
        <Link
          href="/blanks"
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Start filling in blanks to see your accuracy here
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {formatDate(payload[1]?.payload.createdAt)}
                          </span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            avg
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <YAxis domain={domain} hide />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="avgAccuracy"
              activeDot={{
                r: 6,
                style: { fill: "hsl(var(--primary))", opacity: 0.25 },
              }}
              style={{
                stroke: "hsl(var(--primary))",
                opacity: 0.25,
              }}
            />
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

      <div className="flex justify-between gap-2 p-6">
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
    </>
  );
}
