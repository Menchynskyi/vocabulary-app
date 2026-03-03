"use server";

import { WordObject, VocabularyMode } from "@/types";
import { geminiModel } from "./index";
import {
  createAiRateLimitError,
  getAiRetryAfterSeconds,
  isAiRateLimitError,
} from "@/utils/aiErrors";
import { assertCurrentUserCanUseAI } from "@/server/auth/queries";
import {
  buildContextEvaluationPrompt,
  buildContextGenerationPrompt,
  contextEvaluationInputSchema,
  contextEvaluationResultSchema,
  contextGenerationResultSchema,
  contextWordSchema,
} from "./prompts";

type ContextSourceWord = Pick<
  WordObject,
  "id" | "word" | "translation" | "meaning" | "example"
>;

export type ContextRound = {
  wordId: number;
  answer: string;
  sentence: string;
  sentenceWithBlank: string;
};

export type ContextRoundPayload = {
  rounds: ContextRound[];
};

export type ContextEvaluationInput = {
  answer: string;
  userAnswer: string;
  sentence: string;
  sentenceWithBlank: string;
};

export type ContextEvaluationPayload = {
  score: number;
  summary: string;
  items: Array<{
    answer: string;
    userAnswer: string;
    correctedSentenceWithHighlight: string;
    explanation: string;
    isCorrect: boolean;
  }>;
};

const extractJsonString = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Empty response from AI");
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeFenceMatch?.[1]) {
    return codeFenceMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("Failed to extract JSON from AI response");
};

const aiCooldownByUser = new Map<string, number>();

const generateJson = async <T>(
  prompt: string,
  schema: { parse: (data: unknown) => T },
  cooldownKey: string,
) => {
  const cooldownUntil = aiCooldownByUser.get(cooldownKey) ?? 0;
  const remainingCooldownMs = cooldownUntil - Date.now();
  if (remainingCooldownMs > 0) {
    throw createAiRateLimitError(Math.ceil(remainingCooldownMs / 1000));
  }
  if (cooldownUntil) {
    aiCooldownByUser.delete(cooldownKey);
  }

  try {
    const response = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const text = response.response.text();
    const parsed = JSON.parse(extractJsonString(text));
    return schema.parse(parsed);
  } catch (error) {
    if (isAiRateLimitError(error)) {
      const retryAfterSeconds = getAiRetryAfterSeconds(error) ?? 30;
      aiCooldownByUser.set(cooldownKey, Date.now() + retryAfterSeconds * 1000);
      throw createAiRateLimitError(retryAfterSeconds);
    }

    throw error;
  }
};

export const generateContextRound = async ({
  words,
  mode,
}: {
  words: ContextSourceWord[];
  mode: VocabularyMode;
}): Promise<ContextRoundPayload> => {
  const userId = await assertCurrentUserCanUseAI();

  const sanitizedWords = words.map((word) =>
    contextWordSchema.parse({
      id: word.id,
      word: word.word.trim(),
      translation: word.translation?.trim() || undefined,
      meaning: word.meaning?.trim() || undefined,
      example: word.example?.trim() || undefined,
    }),
  );

  const result = await generateJson(
    buildContextGenerationPrompt(mode, sanitizedWords),
    contextGenerationResultSchema,
    userId,
  );

  const validWordIds = new Set(sanitizedWords.map((word) => word.id));
  const rounds = result.rounds.filter((round) =>
    validWordIds.has(round.wordId),
  );

  if (!rounds.length) {
    throw new Error("Failed to generate context round");
  }

  return {
    rounds,
  };
};

export const evaluateContextAnswers = async ({
  items,
}: {
  items: ContextEvaluationInput[];
}): Promise<ContextEvaluationPayload> => {
  const userId = await assertCurrentUserCanUseAI();

  const sanitizedItems = items.map((item) =>
    contextEvaluationInputSchema.parse(item),
  );

  const result = await generateJson(
    buildContextEvaluationPrompt({ items: sanitizedItems }),
    contextEvaluationResultSchema,
    userId,
  );

  if (result.items.length !== sanitizedItems.length) {
    throw new Error("Invalid evaluation response length");
  }

  return result;
};
