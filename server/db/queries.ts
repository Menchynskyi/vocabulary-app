"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from ".";
import { blanksStats } from "./schema";
import { numberToDoublePrecision } from "@/utils/numbers";
import { count, eq } from "drizzle-orm";

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
