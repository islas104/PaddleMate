import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Matches" };

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select(`*, booking:bookings(starts_at, ends_at, court:courts(name, club:clubs(name, city))), players:match_players(user_id, profile:profiles(full_name, skill_level))`)
    .eq("status", "open")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Matches</p>
          <h1 className="text-4xl font-black">Open matches</h1>
          <p className="text-gray-400 mt-2">Find players at your level and join a game</p>
        </div>

        {matches && matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(matches as any[]).map((match) => {
              const playerCount = match.players?.length ?? 0;
              const spotsLeft = match.max_players - playerCount;
              return (
                <div key={match.id} className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-brand-500/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wide bg-brand-950/60 text-brand-400 border border-brand-800/50 px-2.5 py-1 rounded-full">
                      {match.format}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${spotsLeft > 0 ? "bg-green-950/50 text-green-400 border-green-800" : "bg-red-950/50 text-red-400 border-red-800"}`}>
                      {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Full"}
                    </span>
                  </div>
                  {match.booking && (
                    <div>
                      <p className="font-bold text-white">{match.booking.court?.club?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{match.booking.court?.club?.city}</p>
                      <p className="text-xs text-brand-400 mt-2">
                        {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(match.booking.starts_at))}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-4">
                    {match.players?.slice(0, 4).map((p: any, i: number) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
                        {p.profile?.full_name?.[0] ?? "?"}
                      </div>
                    ))}
                    {playerCount === 0 && <span className="text-xs text-gray-600">No players yet</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Level: <span className="capitalize text-gray-400">{match.skill_level}</span></p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">No open matches right now.</div>
        )}
      </div>
    </div>
  );
}
