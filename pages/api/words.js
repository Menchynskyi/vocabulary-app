import { getWords } from "@/app/utils";

export default async function handler(req, res) {
  const words = await getWords(
    Math.random() < 0.5 ? "ascending" : "descending"
  );
  res.status(200).json(words);
}
