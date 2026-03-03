"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from ".";
import { blanksStats, cardsStats, matchUpStats } from "./schema";
import { numberToDoublePrecision } from "@/utils/numbers";
import { and, count, eq, gte, lt } from "drizzle-orm";

export const getUserBlanksStats = async (pageNumber: number, size = 20) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const totalUserBlanksStats = await db
    .select({ count: count() })
    .from(blanksStats)
    .where(eq(blanksStats.userId, user.userId));

  const totalPages = Math.ceil(totalUserBlanksStats[0].count / size);

  const userBlanksStats = await db.query.blanksStats.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
    columns: {
      accuracy: true,
      avgAccuracy: true,
      createdAt: true,
    },
    limit: size,
    offset: (pageNumber - 1) * size,
  });

  return {
    data: [...userBlanksStats].reverse(),
    totalPages,
  };
};

export const createUserBlanksStats = async (accuracy: number) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  try {
    const lastBlanksStats = await db.query.blanksStats.findFirst({
      where: (model, { eq }) => eq(model.userId, user.userId),
      orderBy: (model, { desc }) => desc(model.createdAt),
      columns: {
        avgAccuracy: true,
        attemptNumber: true,
      },
    });

    let avgAccuracy = accuracy;
    let attemptNumber = 1;
    if (lastBlanksStats) {
      avgAccuracy = numberToDoublePrecision(
        (lastBlanksStats.avgAccuracy * lastBlanksStats.attemptNumber +
          accuracy) /
          (lastBlanksStats.attemptNumber + 1),
      );
      attemptNumber = lastBlanksStats.attemptNumber + 1;
    }

    await db.insert(blanksStats).values({
      accuracy,
      avgAccuracy,
      attemptNumber,
      userId: user.userId,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user blanks stats");
  }
};

export const createUserCardsStats = async (wordsCompleted: number) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  try {
    await db.insert(cardsStats).values({
      userId: user.userId,
      wordsCompleted,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user cards stats");
  }
};

type MatchUpStatsPayload = {
  accuracy: number;
  mistakes: number;
  initialLives: number;
};

export const createUserMatchUpStats = async ({
  accuracy,
  mistakes,
  initialLives,
}: MatchUpStatsPayload) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  try {
    await db.insert(matchUpStats).values({
      userId: user.userId,
      accuracy: numberToDoublePrecision(accuracy),
      mistakes,
      initialLives,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user match-up stats");
  }
};

export const getUserCardsDailyWords = async (pageNumber: number, size = 20) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const data = await db.query.cardsStats.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId!),
    orderBy: (model, { asc }) => asc(model.createdAt),
    columns: {
      wordsCompleted: true,
      createdAt: true,
    },
  });

  const byDay = new Map<
    string,
    {
      date: Date;
      wordsCompleted: number;
    }
  >();

  data.forEach((item) => {
    const createdAt = item.createdAt;
    const dayKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(createdAt.getDate()).padStart(2, "0")}`;

    const existing = byDay.get(dayKey);
    if (!existing) {
      byDay.set(dayKey, {
        date: new Date(
          createdAt.getFullYear(),
          createdAt.getMonth(),
          createdAt.getDate(),
        ),
        wordsCompleted: item.wordsCompleted,
      });
      return;
    }

    existing.wordsCompleted += item.wordsCompleted;
  });

  const groupedByDay = [...byDay.values()].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
  const totalPages = Math.ceil(groupedByDay.length / size);
  const paged = groupedByDay.slice((pageNumber - 1) * size, pageNumber * size);

  return {
    data: [...paged].reverse(),
    totalPages,
  };
};

export const getUserMatchUpStats = async (pageNumber: number, size = 20) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const totalUserMatchUpStats = await db
    .select({ count: count() })
    .from(matchUpStats)
    .where(eq(matchUpStats.userId, user.userId));

  const totalPages = Math.ceil(totalUserMatchUpStats[0].count / size);

  const userMatchUpStats = await db.query.matchUpStats.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
    columns: {
      accuracy: true,
      mistakes: true,
      initialLives: true,
      createdAt: true,
    },
    limit: size,
    offset: (pageNumber - 1) * size,
  });

  return {
    data: [...userMatchUpStats].reverse(),
    totalPages,
  };
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getUserGamesMonthlyUsageByYear = async (year: number) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const [blanksRows, cardsRows, matchUpRows] = await Promise.all([
    db.query.blanksStats.findMany({
      where: and(
        eq(blanksStats.userId, user.userId),
        gte(blanksStats.createdAt, startOfYear),
        lt(blanksStats.createdAt, startOfNextYear),
      ),
      columns: { createdAt: true },
    }),
    db.query.cardsStats.findMany({
      where: and(
        eq(cardsStats.userId, user.userId),
        gte(cardsStats.createdAt, startOfYear),
        lt(cardsStats.createdAt, startOfNextYear),
      ),
      columns: { createdAt: true },
    }),
    db.query.matchUpStats.findMany({
      where: and(
        eq(matchUpStats.userId, user.userId),
        gte(matchUpStats.createdAt, startOfYear),
        lt(matchUpStats.createdAt, startOfNextYear),
      ),
      columns: { createdAt: true },
    }),
  ]);

  const monthly = Array.from({ length: 12 }).map((_, month) => ({
    month: monthLabels[month],
    blanks: 0,
    cards: 0,
    matchUp: 0,
  }));

  blanksRows.forEach((row) => {
    monthly[row.createdAt.getMonth()].blanks += 1;
  });
  cardsRows.forEach((row) => {
    monthly[row.createdAt.getMonth()].cards += 1;
  });
  matchUpRows.forEach((row) => {
    monthly[row.createdAt.getMonth()].matchUp += 1;
  });

  return monthly;
};

export const getUserGamesUsageYears = async () => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const [blanksRows, cardsRows, matchUpRows] = await Promise.all([
    db.query.blanksStats.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId!),
      columns: { createdAt: true },
    }),
    db.query.cardsStats.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId!),
      columns: { createdAt: true },
    }),
    db.query.matchUpStats.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId!),
      columns: { createdAt: true },
    }),
  ]);

  const currentYear = new Date().getFullYear();
  const availableYears = new Set<number>([currentYear]);

  blanksRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));
  cardsRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));
  matchUpRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));

  return [...availableYears].sort((a, b) => a - b);
};

export const getClosestYear = (year: number, availableYears: number[]) => {
  if (availableYears.includes(year)) {
    return year;
  }

  return availableYears.reduce((closest, current) =>
    Math.abs(current - year) < Math.abs(closest - year) ? current : closest,
  );
};
