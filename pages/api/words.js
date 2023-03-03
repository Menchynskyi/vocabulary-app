// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getRandomSetOfWords } from "@/app/utils";

export default async function handler(req, res) {
  const words = await getRandomSetOfWords();
  res.status(200).json(words);
}
