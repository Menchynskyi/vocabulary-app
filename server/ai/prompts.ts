import { z } from "zod";

export const contextWordSchema = z.object({
  id: z.number(),
  word: z.string().min(1),
  translation: z.string().optional(),
  meaning: z.string().optional(),
  example: z.string().optional(),
});

export type ContextWord = z.infer<typeof contextWordSchema>;

export const contextGenerationResultSchema = z.object({
  rounds: z
    .array(
      z.object({
        wordId: z.number(),
        answer: z.string().min(1),
        sentence: z.string().min(1),
        sentenceWithBlank: z.string().min(1),
      }),
    )
    .min(1),
});

export type ContextGenerationResult = z.infer<
  typeof contextGenerationResultSchema
>;

export const contextEvaluationInputSchema = z.object({
  answer: z.string().min(1),
  userAnswer: z.string().min(1),
  sentence: z.string().min(1),
  sentenceWithBlank: z.string().min(1),
  usedHint: z.boolean(),
});

const contextEvaluationResultItemSchema = z.object({
  answer: z.string().min(1),
  userAnswer: z.string().min(1),
  correctedSentenceWithHighlight: z.string().min(1),
  explanation: z.string(),
  isCorrect: z.boolean(),
});

export const contextEvaluationResultSchema = z.object({
  score: z.number().int().min(1).max(100),
  summary: z.string().min(1),
  items: z.array(contextEvaluationResultItemSchema).min(1),
});

export type ContextEvaluationResult = z.infer<
  typeof contextEvaluationResultSchema
>;

const stringifyJson = (value: unknown) => JSON.stringify(value, null, 2);

export const buildContextGenerationPrompt = (
  mode: string,
  words: ContextWord[],
) => `You are an English tutor.
Generate one natural English sentence for each vocabulary target.

Rules:
- Use each target word/expression exactly as provided in "word".
- Make sentence level suitable for A2-B2 learners.
- Keep sentence length 8-18 words.
- Each sentence must be unique and grammatically correct.
- Replace only the target word/expression with exactly three underscores: ___
- Keep punctuation natural.
- Do not add markdown.
- Return JSON only.

Input mode: ${mode}
Input words:
${stringifyJson(words)}

Output JSON schema:
{
  "rounds": [
    {
      "wordId": number,
      "answer": "string",
      "sentence": "string",
      "sentenceWithBlank": "string"
    }
  ]
}
`;

export const buildContextEvaluationPrompt = (payload: unknown) => `You are an English tutor and evaluator.
Evaluate user answers for sentence blanks.

Rules:
- Compare answers case-insensitively.
- Provide fair scoring from 1 to 100 where 100 means all correct.
- If only minor spelling error exists, score should still decrease.
- If user used hints, reduce score accordingly (relative to answers quality).
- If usedHint is true for an item, mention hint usage in that item's explanation.
- summary must NOT repeat or mention the numeric score. Focus on specific areas the user should work on (e.g. prepositions, spelling, verb forms, collocations). Keep it 1-3 short actionable sentences.
- For each item return a corrected sentence with the expected answer highlighted using <hl>expected answer</hl>.
- explanation must be concise and specific. For correct answers where there is nothing noteworthy, use an empty string "".
- Return JSON only.
- Do not include markdown.

Input:
${stringifyJson(payload)}

Output JSON schema:
{
  "score": number,
  "summary": "string",
  "items": [
    {
      "answer": "string",
      "userAnswer": "string",
      "correctedSentenceWithHighlight": "string with <hl>...</hl>",
      "explanation": "string",
      "isCorrect": boolean
    }
  ]
}
`;
