import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { BookingPanel } from "@/components/booking/BookingPanel";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("courts").select("name").eq("id", id).single();
  return { title: data?.name ?? "Court" };
}

const surfaceLabel: Record<string, string> = {
  artificial_grass: "Artificial grass",
  concrete: "Concrete",
  crystal: "Crystal",
  sand: "Sand",
};

export default async function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: courtRaw } = await supabase
    .from("courts")
    .select("*, club:clubs(id, name, address, city, country, phone, email)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!courtRaw) notFound();
  const court = courtRaw as any;

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <p className="text-sm text-gray-500 mb-6">
          <a href="/courts" className="hover:text-brand-400 transition-colors">Courts</a>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{court.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-gradient-to-br from-brand-950 via-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.2),transparent)]" />
              <span className="text-7xl relative z-10">🎾</span>
            </div>

            <div>
              <h1 className="text-3xl font-black">{court.name}</h1>
              <p className="text-brand-400 font-semibold mt-1">{court.club?.name}</p>
              <p className="text-gray-500 text-sm mt-0.5">{court.club?.address}, {court.club?.city}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Surface", value: surfaceLabel[court.surface] ?? court.surface },
                { label: "Type", value: court.type.charAt(0).toUpperCase() + court.type.slice(1) },
                { label: "Price", value: `£${court.price_per_hour}/hr` },
                { label: "Currency", value: court.currency },
              ].map((d) => (
                <div key={d.label} className="bg-gray-900 border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{d.label}</p>
                  <p className="font-bold text-white">{d.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">Club info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                {court.club?.phone && <p>📞 {court.club.phone}</p>}
                {court.club?.email && <p>✉️ {court.club.email}</p>}
                <p>📍 {court.club?.address}, {court.club?.city}, {court.club?.country}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingPanel
              courtId={court.id}
              pricePerHour={court.price_per_hour}
              currency={court.currency}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
