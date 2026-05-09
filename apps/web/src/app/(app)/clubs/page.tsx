import { createClient } from "@/lib/supabase/server";
import { ClubCard } from "@/components/clubs/ClubCard";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Clubs" };

export default async function ClubsPage() {
  const supabase = await createClient();
  const { data: clubs } = await supabase.from("clubs").select("*").eq("is_active", true);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Clubs</p>
          <h1 className="text-4xl font-black">Find a club</h1>
          <p className="text-gray-400 mt-2">Browse paddle clubs near you</p>
        </div>
        {clubs && clubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubs.map((club: any) => <ClubCard key={club.id} club={club} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">No clubs listed yet.</div>
        )}
      </div>
    </div>
  );
}
