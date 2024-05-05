"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from ".";
import { blanksStats } from "./schema";

export const getUserBlanksStats = async () => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const blanksStats = await db.query.blanksStats.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
    columns: {
      id: true,
      accuracy: true,
      createdAt: true,
    },
  });

  return blanksStats;
};

export const createUserBlanksStats = async (accuracy: number) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  try {
    await db.insert(blanksStats).values({
      accuracy,
      userId: user.userId,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user blanks stats");
  }
};
