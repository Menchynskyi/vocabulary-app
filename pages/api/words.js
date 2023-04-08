import { getWords } from "@/app/utils";

export default async function handler(req, res) {
  const randomWords = await getWords();

  res.status(200).json(randomWords);
}
