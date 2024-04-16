import { cookies } from "next/headers";
import { DateRangeMode } from "@/types";
import { uri } from "@/constants";
import { WordsList } from "./_components/WordsList";

async function getWords(mode?: DateRangeMode) {
  try {
    const response = await fetch(`${uri}/api/words?mode=${mode}`, {
      cache: "no-store",
      headers: {
        Cookie: cookies().toString(),
      },
    });
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

type CardsProps = {
  searchParams: {
    mode?: DateRangeMode;
  };
};

export default async function Cards({ searchParams }: CardsProps) {
  const words = await getWords(searchParams?.mode);

  return <WordsList words={words} dateRangeMode={searchParams?.mode} />;
}
