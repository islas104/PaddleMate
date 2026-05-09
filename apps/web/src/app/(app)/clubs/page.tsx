import { createClient } from "@/lib/supabase/server";
import { getClubs } from "@paddlemate/supabase";
import { ClubCard } from "@/components/clubs/ClubCard";

export const metadata = { title: "Clubs" };

export default async function ClubsPage() {
  const supabase = await createClient();
  const { data: clubs } = await getClubs(supabase);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Clubs</h1>
      <p className="text-gray-500 mb-8">Find and join a paddle club near you</p>

      {clubs && clubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club: any) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          No clubs listed yet.
        </div>
      )}
    </div>
  );
}
