"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  courtId: string;
  pricePerHour: number;
  currency: string;
  isLoggedIn: boolean;
}

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function BookingPanel({ courtId, pricePerHour, currency, isLoggedIn }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(todayStr());
  const [slot, setSlot] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const symbol = currency === "GBP" ? "£" : "€";

  // Fetch taken slots whenever date changes
  useEffect(() => {
    async function fetchAvailability() {
      setChecking(true);
      setSlot(null);
      const supabase = createClient();
      const { data } = await supabase
        .from("bookings")
        .select("starts_at")
        .eq("court_id", courtId)
        .gte("starts_at", `${date}T00:00:00`)
        .lte("starts_at", `${date}T23:59:59`)
        .neq("status", "cancelled");

      const taken = new Set(
        (data ?? []).map((b: any) =>
          new Date(b.starts_at).toTimeString().slice(0, 5)
        )
      );
      setTakenSlots(taken);
      setChecking(false);
    }
    fetchAvailability();
  }, [date, courtId]);

  async function handleBook() {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (!slot) return;

    setLoading(true);
    setError(null);

    const startsAt = new Date(`${date}T${slot}:00`);
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("bookings").insert({
      court_id: courtId,
      user_id: user!.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      total_price: pricePerHour,
      notes: null,
    } as any);

    setLoading(false);
    if (error) { setError("This slot was just taken. Please pick another time."); setSlot(null); return; }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (success) {
    return (
      <div className="bg-brand-950/50 border border-brand-700 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-brand-400 text-lg">Booking confirmed!</p>
        <p className="text-gray-400 text-sm mt-1">Redirecting to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 sticky top-24">
      <h2 className="font-black text-white text-lg mb-5">Book this court</h2>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Date</label>
        <input
          type="date"
          value={date}
          min={todayStr()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Time slots */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Time slot</label>
          {checking && <span className="text-xs text-gray-600">Checking…</span>}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {TIME_SLOTS.map((t) => {
            const taken = takenSlots.has(t);
            const past = date === todayStr() && t <= new Date().toTimeString().slice(0, 5);
            const disabled = taken || past;
            return (
              <button
                key={t}
                onClick={() => !disabled && setSlot(t)}
                disabled={disabled}
                className={`py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  slot === t
                    ? "bg-brand-500 text-white"
                    : disabled
                    ? "bg-gray-800/40 text-gray-700 cursor-not-allowed line-through"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {t}
                {taken && !past && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Taken</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-800/40 inline-block" /> Unavailable</span>
        </div>
      </div>

      {/* Summary */}
      {slot && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4 text-sm">
          <div className="flex justify-between text-gray-400 mb-1">
            <span>{date} at {slot}</span>
            <span>1 hour</span>
          </div>
          <div className="flex justify-between font-black text-white text-base mt-2 pt-2 border-t border-white/10">
            <span>Total</span>
            <span className="text-brand-400">{symbol}{pricePerHour.toFixed(2)}</span>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleBook}
        disabled={!slot || loading}
        className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        {loading ? "Booking…" : isLoggedIn ? (slot ? "Confirm booking" : "Select a time slot") : "Sign in to book"}
      </button>

      <p className="text-center text-xs text-gray-600 mt-3">No payment taken yet</p>
    </div>
  );
}
