import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clubs").select("name").eq("id", id).single();
  return { title: (data as any)?.name ?? "Club" };
}

const surfaceLabel: Record<string, string> = {
  artificial_grass: "Artificial grass",
  concrete: "Concrete",
  crystal: "Crystal",
  sand: "Sand",
};

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: clubRaw } = await supabase
    .from("clubs")
    .select("*, courts(*), members:club_members(role)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!clubRaw) notFound();
  const club = clubRaw as any;
  const courts = club.courts ?? [];
  const memberCount = club.members?.length ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-950 via-gray-900 to-gray-900 border border-white/5 overflow-hidden mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(22,163,74,0.2),transparent_60%)]" />
          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-3xl mb-4">
                  🏟️
                </div>
                <h1 className="text-4xl font-black">{club.name}</h1>
                <p className="text-gray-400 mt-1">📍 {club.address}, {club.city}, {club.country}</p>
                {club.description && (
                  <p className="text-gray-300 mt-3 max-w-xl leading-relaxed">{club.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {club.phone && (
                  <a href={`tel:${club.phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    📞 {club.phone}
                  </a>
                )}
                {club.email && (
                  <a href={`mailto:${club.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    ✉️ {club.email}
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/5">
              {[
                { value: courts.length, label: "Courts" },
                { value: memberCount, label: "Members" },
                { value: "24/7", label: "Open" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-brand-400">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courts */}
        <h2 className="text-2xl font-black mb-5">Courts</h2>
        {courts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courts.map((court: any) => (
              <Link
                key={court.id}
                href={`/courts/${court.id}`}
                className="group bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/30 transition-all"
              >
                <div className="h-36 bg-gradient-to-br from-brand-950 to-gray-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.15),transparent)]" />
                  <span className="text-4xl relative z-10">🎾</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white">{court.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{surfaceLabel[court.surface] ?? court.surface} · {court.type}</p>
                  <p className="text-brand-400 font-black mt-2">{formatPrice(court.price_per_hour, court.currency)}/hr</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No courts listed yet.</p>
        )}
      </div>
    </div>
  );
}
