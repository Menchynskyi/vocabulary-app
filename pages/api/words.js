import { getWords } from "@/app/utils";

export default async function handler(req, res) {
  const words = await getWords();
  res.status(200).json(words);
}
