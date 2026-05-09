import { createClient } from "@/lib/supabase/server";
import { getCourts } from "@paddlemate/supabase";
import { CourtCard } from "@/components/courts/CourtCard";

export const metadata = { title: "Courts" };

export default async function CourtsPage() {
  const supabase = createClient();
  const { data: courts } = await getCourts(supabase);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Find a court</h1>
      <p className="text-gray-500 mb-8">Browse available paddle courts near you</p>

      {courts && courts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          No courts available yet.
        </div>
      )}
    </div>
  );
}
