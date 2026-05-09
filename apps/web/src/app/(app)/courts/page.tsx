import { createClient } from "@/lib/supabase/server";
import { CourtCard } from "@/components/courts/CourtCard";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Courts" };

export default async function CourtsPage() {
  const supabase = await createClient();
  const { data: courtsRaw, error } = await supabase
    .from("courts")
    .select("*, club:clubs(id, name, address, city, logo_url)")
    .eq("is_active", true);
  const courts = courtsRaw as any[] | null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Courts</p>
          <h1 className="text-4xl font-black">Find a court</h1>
          <p className="text-gray-400 mt-2">Browse available paddle courts near you</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 mb-8 text-sm">
            Error: {error.message}
          </div>
        )}

        {courts && courts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">
            No courts available yet.
          </div>
        )}
      </div>
    </div>
  );
}
