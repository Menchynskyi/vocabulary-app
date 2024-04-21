import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Matchup() {
  const blanksStats = await db.query.blanksStats.findFirst();

  return (
    <div>
      <h1 className="text-2xl sm:text-6xl">Coming Soon...</h1>
      <p className="mt-4 text-center text-lg sm:text-2xl">
        Your accuracy is {blanksStats?.accuracy}%
      </p>
    </div>
  );
}
