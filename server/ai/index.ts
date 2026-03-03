import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const geminiClient = new GoogleGenerativeAI(geminiApiKey);

export const geminiModel = geminiClient.getGenerativeModel({
  model: "gemini-2.5-flash",
});
