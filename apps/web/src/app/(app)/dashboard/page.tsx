import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";

export const metadata = { title: "Dashboard" };

function statusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-brand-950/60 text-brand-400 border-brand-800",
    pending:   "bg-yellow-950/60 text-yellow-400 border-yellow-800",
    cancelled: "bg-red-950/60 text-red-400 border-red-800",
    completed: "bg-gray-800 text-gray-400 border-gray-700",
  };
  return map[status] ?? "bg-gray-800 text-gray-400 border-gray-700";
}

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: bookingsRaw }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("bookings")
      .select("*, court:courts(name, club:clubs(name, city))")
      .eq("user_id", user.id)
      .order("starts_at", { ascending: false })
      .limit(20),
  ]);

  const p = profile as any;
  const bookings = (bookingsRaw as any[]) ?? [];
  const upcoming = bookings.filter((b) => new Date(b.starts_at) > new Date() && b.status !== "cancelled");
  const past = bookings.filter((b) => new Date(b.starts_at) <= new Date() || b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Profile header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-2xl font-black shrink-0">
            {p?.full_name?.[0] ?? user.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{p?.full_name ?? "Player"}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-brand-950/60 text-brand-400 border border-brand-800 px-2 py-0.5 rounded-full capitalize">
              {p?.skill_level ?? "beginner"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Upcoming", value: upcoming.length },
            { label: "Total bookings", value: bookings.length },
            { label: "This month", value: bookings.filter((b) => new Date(b.starts_at).getMonth() === new Date().getMonth()).length },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black text-brand-400">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">Upcoming bookings</h2>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-950/60 border border-brand-800/50 flex items-center justify-center text-xl shrink-0">
                      🎾
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{b.court?.name}</p>
                      <p className="text-sm text-gray-500">{b.court?.club?.name} · {b.court?.club?.city}</p>
                      <p className="text-xs text-brand-400 mt-0.5">{formatSlot(b.starts_at)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-xs border px-2.5 py-1 rounded-full capitalize ${statusBadge(b.status)}`}>
                      {b.status}
                    </span>
                    <p className="text-sm font-black text-white">£{b.total_price}</p>
                    <CancelBookingButton bookingId={b.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-gray-500 mb-4">No upcoming bookings</p>
              <Link href="/courts" className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Book a court →
              </Link>
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-black mb-4 text-gray-500">Past bookings</h2>
            <div className="space-y-3">
              {past.map((b) => (
                <div key={b.id} className="bg-gray-900/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 opacity-60">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{b.court?.name}</p>
                    <p className="text-sm text-gray-500">{b.court?.club?.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{formatSlot(b.starts_at)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs border px-2.5 py-1 rounded-full capitalize ${statusBadge(b.status)}`}>
                      {b.status}
                    </span>
                    <p className="text-sm font-black text-white mt-1">£{b.total_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
