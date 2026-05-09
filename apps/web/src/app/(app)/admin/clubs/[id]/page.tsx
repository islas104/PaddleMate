import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Club Admin" };

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-brand-950/60 text-brand-400 border-brand-800",
    pending:   "bg-yellow-950/60 text-yellow-400 border-yellow-800",
    cancelled: "bg-red-950/60 text-red-400 border-red-800",
    completed: "bg-gray-800 text-gray-400 border-gray-700",
  };
  return map[status] ?? "bg-gray-800 text-gray-400 border-gray-700";
}

export default async function ClubAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("club_members")
    .select("role")
    .eq("club_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership || !["owner", "admin"].includes((membership as any).role)) notFound();

  const [{ data: clubRaw }, { data: courts }, { data: bookingsRaw }] = await Promise.all([
    supabase.from("clubs").select("*").eq("id", id).single(),
    supabase.from("courts").select("*").eq("club_id", id).order("name"),
    supabase
      .from("bookings")
      .select("*, court:courts!inner(name, club_id), user:profiles(full_name, email)")
      .eq("courts.club_id", id)
      .order("starts_at", { ascending: false })
      .limit(50),
  ]);
  const club = clubRaw as any;

  if (!club) notFound();

  const bookings = (bookingsRaw as any[]) ?? [];
  const upcoming = bookings.filter((b) => new Date(b.starts_at) > new Date() && b.status !== "cancelled");
  const totalRevenue = bookings
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-3xl font-black">{club.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{club.address}, {club.city}</p>
          </div>
          <Link
            href={`/clubs/${id}`}
            className="text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-xl transition-colors"
          >
            View public page →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Courts", value: courts?.length ?? 0, icon: "🎾" },
            { label: "Upcoming bookings", value: upcoming.length, icon: "📅" },
            { label: "Total bookings", value: bookings.length, icon: "📋" },
            { label: "Revenue (paid)", value: `£${totalRevenue.toFixed(0)}`, icon: "💰" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-white/5 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-brand-400">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courts management */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-black mb-4">Courts</h2>
            <div className="space-y-3">
              {(courts ?? []).map((court: any) => (
                <div key={court.id} className="bg-gray-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{court.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{court.surface.replace("_", " ")} · {court.type}</p>
                    <p className="text-xs text-brand-400 font-bold mt-1">£{court.price_per_hour}/hr</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${court.is_active ? "bg-brand-950/50 text-brand-400 border-brand-800" : "bg-gray-800 text-gray-500 border-gray-700"}`}>
                    {court.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-4">Recent bookings</h2>
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-gray-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white text-sm">{b.user?.full_name ?? b.user?.email ?? "Unknown"}</p>
                        <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${statusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{b.court?.name} · {formatSlot(b.starts_at)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-white">£{b.total_price}</p>
                      <p className="text-xs text-gray-600 mt-0.5 capitalize">{b.payment_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 text-center text-gray-600">
                No bookings yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
