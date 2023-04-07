import { getWords } from "@/app/utils";

export default async function handler(req, res) {
  const words = await getWords();
  process.env.WORDS = JSON.stringify(words);

  res.status(200).end("Generated");
}
