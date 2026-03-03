"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from ".";
import {
  blanksStats,
  cardsStats,
  contextStats,
  matchUpStats,
  userSettings,
} from "./schema";
import { numberToDoublePrecision } from "@/utils/numbers";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import {
  cardsListLatestLengthCookie,
  cardsListRandomLengthCookie,
  cardsListWeekModeLengthCookie,
  defaultCardsListLatestLength,
  defaultCardsListRandomLength,
  defaultCardsListWeekModeLength,
} from "@/constants/cards";
import { BlanksDifficulty } from "@/types";
import { blanksDifficultyCookie } from "@/constants/blanks";
import {
  defaultMatchUpLives,
  defaultMatchUpWordsCount,
  matchUpLivesCookie,
  matchUpLivesMax,
  matchUpLivesMin,
  matchUpWordsCountCookie,
  matchUpWordsCountMax,
  matchUpWordsCountMin,
} from "@/constants/match-up";
import {
  contextWordsCountMax,
  contextWordsCountMin,
  defaultContextWordsCount,
} from "@/constants/context";
import {
  VoiceName,
  defaultVoiceOption,
  voiceNameCookie,
  voiceOptions,
} from "@/constants/voice";
import { assertCurrentUserCanUseAI } from "@/server/auth/queries";

const userSettingsGames = [
  "cards",
  "blanks",
  "match-up",
  "context",
  "global",
] as const;

type UserSettingsGame = (typeof userSettingsGames)[number];

type UserCardsSettings = {
  cardsListLatestLength: number;
  cardsListRandomLength: number;
  cardsListWeekModeLength: number;
};

type UserBlanksSettings = {
  blanksDifficulty: BlanksDifficulty;
};

type UserMatchUpSettings = {
  matchUpLives: number;
  matchUpWordsCount: number;
};

type UserGlobalSettings = {
  voiceName: VoiceName;
};

type UserContextSettings = {
  contextWordsCount: number;
};

export type AuthorizedUserSettings = {
  cards?: UserCardsSettings;
  blanks?: UserBlanksSettings;
  "match-up"?: UserMatchUpSettings;
  context?: UserContextSettings;
  global?: UserGlobalSettings;
};

export type UpsertAuthorizedUserSettingsInput = {
  cards?: Partial<UserCardsSettings>;
  blanks?: Partial<UserBlanksSettings>;
  "match-up"?: Partial<UserMatchUpSettings>;
  context?: Partial<UserContextSettings>;
  global?: Partial<UserGlobalSettings>;
};

const validBlanksDifficultyValues = new Set(Object.values(BlanksDifficulty));
const validVoiceNames = new Set(voiceOptions.map((item) => item.name));
const isVoiceName = (value: string): value is VoiceName =>
  validVoiceNames.has(value as VoiceName);

const clampRange = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const isValidAccuracyScore = (value: number) =>
  Number.isFinite(value) && Number.isInteger(value) && value >= 1 && value <= 100;

const sanitizeCardsSettings = (settings: Partial<UserCardsSettings>) => {
  const parsedLatest = Number(settings.cardsListLatestLength);
  const parsedRandom = Number(settings.cardsListRandomLength);
  const parsedWeek = Number(settings.cardsListWeekModeLength);

  return {
    cardsListLatestLength: Number.isFinite(parsedLatest)
      ? clampRange(parsedLatest, 5, 50)
      : defaultCardsListLatestLength,
    cardsListRandomLength: Number.isFinite(parsedRandom)
      ? clampRange(parsedRandom, 5, 50)
      : defaultCardsListRandomLength,
    cardsListWeekModeLength: Number.isFinite(parsedWeek)
      ? clampRange(parsedWeek, 5, 50)
      : defaultCardsListWeekModeLength,
  };
};

const sanitizeBlanksSettings = (settings: Partial<UserBlanksSettings>) => {
  const blanksDifficulty = settings.blanksDifficulty;
  return {
    blanksDifficulty:
      blanksDifficulty && validBlanksDifficultyValues.has(blanksDifficulty)
        ? blanksDifficulty
        : BlanksDifficulty.Easy,
  };
};

const sanitizeMatchUpSettings = (settings: Partial<UserMatchUpSettings>) => {
  const parsedLives = Number(settings.matchUpLives);
  const parsedWordsCount = Number(settings.matchUpWordsCount);

  return {
    matchUpLives: Number.isFinite(parsedLives)
      ? clampRange(parsedLives, matchUpLivesMin, matchUpLivesMax)
      : defaultMatchUpLives,
    matchUpWordsCount: Number.isFinite(parsedWordsCount)
      ? clampRange(parsedWordsCount, matchUpWordsCountMin, matchUpWordsCountMax)
      : defaultMatchUpWordsCount,
  };
};

const sanitizeGlobalSettings = (settings: Partial<UserGlobalSettings>) => {
  const voiceName = settings.voiceName;
  return {
    voiceName: voiceName && isVoiceName(voiceName) ? voiceName : defaultVoiceOption.name,
  };
};

const sanitizeContextSettings = (settings: Partial<UserContextSettings>) => {
  const parsedWordsCount = Number(settings.contextWordsCount);
  return {
    contextWordsCount: Number.isFinite(parsedWordsCount)
      ? clampRange(parsedWordsCount, contextWordsCountMin, contextWordsCountMax)
      : defaultContextWordsCount,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getSanitizedGameSettings = (
  game: UserSettingsGame,
  rawSettings: unknown,
):
  | UserCardsSettings
  | UserBlanksSettings
  | UserMatchUpSettings
  | UserContextSettings
  | UserGlobalSettings => {
  if (!isRecord(rawSettings)) {
    if (game === "cards") return sanitizeCardsSettings({});
    if (game === "blanks") return sanitizeBlanksSettings({});
    if (game === "match-up") return sanitizeMatchUpSettings({});
    if (game === "context") return sanitizeContextSettings({});
    return sanitizeGlobalSettings({});
  }

  if (game === "cards") {
    return sanitizeCardsSettings(rawSettings as Partial<UserCardsSettings>);
  }
  if (game === "blanks") {
    return sanitizeBlanksSettings(rawSettings as Partial<UserBlanksSettings>);
  }
  if (game === "match-up") {
    return sanitizeMatchUpSettings(rawSettings as Partial<UserMatchUpSettings>);
  }
  if (game === "context") {
    return sanitizeContextSettings(rawSettings as Partial<UserContextSettings>);
  }

  return sanitizeGlobalSettings(rawSettings as Partial<UserGlobalSettings>);
};

export const getAuthorizedUserSettings = async (): Promise<AuthorizedUserSettings> => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const rows = await db.query.userSettings.findMany({
    where: (model, { and, eq, inArray }) =>
      and(eq(model.userId, user.userId), inArray(model.game, [...userSettingsGames])),
    columns: {
      game: true,
      settings: true,
    },
  });

  const normalized: AuthorizedUserSettings = {};

  rows.forEach((row) => {
    const game = row.game as UserSettingsGame;
    if (!userSettingsGames.includes(game)) return;

    if (game === "cards") {
      normalized.cards = getSanitizedGameSettings(game, row.settings) as UserCardsSettings;
      return;
    }
    if (game === "blanks") {
      normalized.blanks = getSanitizedGameSettings(
        game,
        row.settings,
      ) as UserBlanksSettings;
      return;
    }
    if (game === "match-up") {
      normalized["match-up"] = getSanitizedGameSettings(
        game,
        row.settings,
      ) as UserMatchUpSettings;
      return;
    }
    if (game === "context") {
      normalized.context = getSanitizedGameSettings(
        game,
        row.settings,
      ) as UserContextSettings;
      return;
    }

    normalized.global = getSanitizedGameSettings(game, row.settings) as UserGlobalSettings;
  });

  return normalized;
};

export const upsertAuthorizedUserSettings = async (
  input: UpsertAuthorizedUserSettingsInput,
) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const updates: Array<{ game: UserSettingsGame; settings: Record<string, unknown> }> = [];

  if (input.cards) {
    updates.push({
      game: "cards",
      settings: sanitizeCardsSettings(input.cards),
    });
  }
  if (input.blanks) {
    updates.push({
      game: "blanks",
      settings: sanitizeBlanksSettings(input.blanks),
    });
  }
  if (input["match-up"]) {
    updates.push({
      game: "match-up",
      settings: sanitizeMatchUpSettings(input["match-up"]),
    });
  }
  if (input.context) {
    updates.push({
      game: "context",
      settings: sanitizeContextSettings(input.context),
    });
  }
  if (input.global) {
    updates.push({
      game: "global",
      settings: sanitizeGlobalSettings(input.global),
    });
  }

  if (!updates.length) return true;

  await Promise.all(
    updates.map(({ game, settings }) =>
      db
        .insert(userSettings)
        .values({
          userId: user.userId!,
          game,
          settings,
        })
        .onConflictDoUpdate({
          target: [userSettings.userId, userSettings.game],
          set: {
            settings,
          },
        }),
    ),
  );

  return true;
};

export const getEffectiveUserSettings = async (
  cookieSettings: {
    cards: UserCardsSettings;
    blanks: UserBlanksSettings;
    "match-up": UserMatchUpSettings;
    context: UserContextSettings;
    global: UserGlobalSettings;
  },
) => {
  const user = auth();

  if (!user.userId) {
    return cookieSettings;
  }

  const dbSettings = await getAuthorizedUserSettings();

  return {
    cards: {
      cardsListLatestLength:
        dbSettings.cards?.cardsListLatestLength ??
        cookieSettings.cards.cardsListLatestLength,
      cardsListRandomLength:
        dbSettings.cards?.cardsListRandomLength ??
        cookieSettings.cards.cardsListRandomLength,
      cardsListWeekModeLength:
        dbSettings.cards?.cardsListWeekModeLength ??
        cookieSettings.cards.cardsListWeekModeLength,
    },
    blanks: {
      blanksDifficulty:
        dbSettings.blanks?.blanksDifficulty ?? cookieSettings.blanks.blanksDifficulty,
    },
    "match-up": {
      matchUpLives:
        dbSettings["match-up"]?.matchUpLives ?? cookieSettings["match-up"].matchUpLives,
      matchUpWordsCount:
        dbSettings["match-up"]?.matchUpWordsCount ??
        cookieSettings["match-up"].matchUpWordsCount,
    },
    context: {
      contextWordsCount:
        dbSettings.context?.contextWordsCount ?? cookieSettings.context.contextWordsCount,
    },
    global: {
      voiceName: dbSettings.global?.voiceName ?? cookieSettings.global.voiceName,
    },
  };
};

export const getDefaultCookieLikeSettings = async (
  cookiesStoreOrPromise:
    | {
        get: (key: string) => { value?: string } | undefined;
      }
    | Promise<{
        get: (key: string) => { value?: string } | undefined;
      }>,
) => {
  const cookiesStore = await cookiesStoreOrPromise;
  const cardsListLatestLengthValue = Number(
    cookiesStore.get(cardsListLatestLengthCookie)?.value,
  );
  const cardsListRandomLengthValue = Number(
    cookiesStore.get(cardsListRandomLengthCookie)?.value,
  );
  const cardsListWeekModeLengthValue = Number(
    cookiesStore.get(cardsListWeekModeLengthCookie)?.value,
  );
  const matchUpLivesValue = Number(cookiesStore.get(matchUpLivesCookie)?.value);
  const matchUpWordsCountValue = Number(cookiesStore.get(matchUpWordsCountCookie)?.value);
  const blanksDifficultyValue = cookiesStore.get(blanksDifficultyCookie)?.value;
  const voiceNameValue = cookiesStore.get(voiceNameCookie)?.value;

  return {
    cards: {
      cardsListLatestLength: Number.isFinite(cardsListLatestLengthValue)
        ? clampRange(cardsListLatestLengthValue, 5, 50)
        : defaultCardsListLatestLength,
      cardsListRandomLength: Number.isFinite(cardsListRandomLengthValue)
        ? clampRange(cardsListRandomLengthValue, 5, 50)
        : defaultCardsListRandomLength,
      cardsListWeekModeLength: Number.isFinite(cardsListWeekModeLengthValue)
        ? clampRange(cardsListWeekModeLengthValue, 5, 50)
        : defaultCardsListWeekModeLength,
    },
    blanks: {
      blanksDifficulty:
        blanksDifficultyValue &&
        validBlanksDifficultyValues.has(blanksDifficultyValue as BlanksDifficulty)
          ? (blanksDifficultyValue as BlanksDifficulty)
          : BlanksDifficulty.Easy,
    },
    "match-up": {
      matchUpLives: Number.isFinite(matchUpLivesValue)
        ? clampRange(matchUpLivesValue, matchUpLivesMin, matchUpLivesMax)
        : defaultMatchUpLives,
      matchUpWordsCount: Number.isFinite(matchUpWordsCountValue)
        ? clampRange(
            matchUpWordsCountValue,
            matchUpWordsCountMin,
            matchUpWordsCountMax,
          )
        : defaultMatchUpWordsCount,
    },
    context: {
      contextWordsCount: defaultContextWordsCount,
    },
    global: {
      voiceName:
        voiceNameValue && isVoiceName(voiceNameValue)
          ? voiceNameValue
          : defaultVoiceOption.name,
    },
  };
};

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

export const getUserContextStats = async (pageNumber: number, size = 20) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const totalUserContextStats = await db
    .select({ count: count() })
    .from(contextStats)
    .where(eq(contextStats.userId, user.userId));

  const totalPages = Math.ceil(totalUserContextStats[0].count / size);

  const userContextStats = await db.query.contextStats.findMany({
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
    data: [...userContextStats].reverse(),
    totalPages,
  };
};

export const createUserContextStats = async (accuracy: number) => {
  const userId = await assertCurrentUserCanUseAI();
  if (!isValidAccuracyScore(accuracy)) {
    throw new Error("Invalid context accuracy score");
  }
  const normalizedAccuracy = numberToDoublePrecision(accuracy);

  try {
    await db.transaction(async (tx) => {
      // Serialize writes per user to avoid race conditions in avg/attempt computation.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

      const lastContextStats = await tx.query.contextStats.findFirst({
        where: (model, { eq }) => eq(model.userId, userId),
        orderBy: (model, { desc }) => desc(model.createdAt),
        columns: {
          avgAccuracy: true,
          attemptNumber: true,
        },
      });

      let avgAccuracy = normalizedAccuracy;
      let attemptNumber = 1;
      if (lastContextStats) {
        avgAccuracy = numberToDoublePrecision(
          (lastContextStats.avgAccuracy * lastContextStats.attemptNumber + normalizedAccuracy) /
            (lastContextStats.attemptNumber + 1),
        );
        attemptNumber = lastContextStats.attemptNumber + 1;
      }

      await tx.insert(contextStats).values({
        accuracy: normalizedAccuracy,
        avgAccuracy,
        attemptNumber,
        userId,
      });
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user context stats");
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

  const [blanksRows, cardsRows, matchUpRows, contextRows] = await Promise.all([
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
    db.query.contextStats.findMany({
      where: and(
        eq(contextStats.userId, user.userId),
        gte(contextStats.createdAt, startOfYear),
        lt(contextStats.createdAt, startOfNextYear),
      ),
      columns: { createdAt: true },
    }),
  ]);

  const monthly = Array.from({ length: 12 }).map((_, month) => ({
    month: monthLabels[month],
    blanks: 0,
    cards: 0,
    matchUp: 0,
    context: 0,
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
  contextRows.forEach((row) => {
    monthly[row.createdAt.getMonth()].context += 1;
  });

  return monthly;
};

export const getUserGamesUsageYears = async () => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const [blanksRows, cardsRows, matchUpRows, contextRows] = await Promise.all([
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
    db.query.contextStats.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId!),
      columns: { createdAt: true },
    }),
  ]);

  const currentYear = new Date().getFullYear();
  const availableYears = new Set<number>([currentYear]);

  blanksRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));
  cardsRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));
  matchUpRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));
  contextRows.forEach((row) => availableYears.add(row.createdAt.getFullYear()));

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
