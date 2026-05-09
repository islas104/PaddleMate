import { createClient } from "@/lib/supabase/server";
import { getOpenMatches } from "@paddlemate/supabase";
import { MatchCard } from "@/components/matches/MatchCard";

export const metadata = { title: "Matches" };

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: matches } = await getOpenMatches(supabase);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Open matches</h1>
      <p className="text-gray-500 mb-8">Find players at your level and join a game</p>

      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match: any) => (
            <MatchCard key={match.id} match={match as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          No open matches right now. Be the first to create one!
        </div>
      )}
    </div>
  );
}
