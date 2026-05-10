import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { CourtsSearch } from "@/components/courts/CourtsSearch";

export const metadata = { title: "Courts — PaddleMate" };

export default async function CourtsPage() {
  const supabase = await createClient();
  const { data: courtsRaw, error } = await supabase
    .from("courts")
    .select("*, club:clubs(id, name, address, city, logo_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const courts = (courtsRaw as any[]) ?? [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-8">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Courts</p>
          <h1 className="text-4xl font-black">Find a court</h1>
          <p className="text-gray-400 mt-2">Browse available paddle courts and book instantly</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 mb-8 text-sm">
            Could not load courts: {error.message}
          </div>
        )}

        <CourtsSearch courts={courts} />
      </div>
    </div>
  );
}
