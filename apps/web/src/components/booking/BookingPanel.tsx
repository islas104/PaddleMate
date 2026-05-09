"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const total = pricePerHour;
  const symbol = currency === "GBP" ? "£" : "€";

  async function handleBook() {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (!slot) return;

    setLoading(true);
    setError(null);

    const startsAt = new Date(`${date}T${slot}:00`);
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);

    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      court_id: courtId,
      user_id: (await supabase.auth.getUser()).data.user!.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      total_price: pricePerHour,
      notes: null,
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
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

      {/* Date picker */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Date</label>
        <input
          type="date"
          value={date}
          min={todayStr()}
          onChange={(e) => { setDate(e.target.value); setSlot(null); }}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Time slots */}
      <div className="mb-5">
        <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Time slot</label>
        <div className="grid grid-cols-4 gap-1.5">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSlot(t)}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                slot === t
                  ? "bg-brand-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
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
            <span className="text-brand-400">{symbol}{total.toFixed(2)}</span>
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

      <p className="text-center text-xs text-gray-600 mt-3">No payment taken yet — confirm on next step</p>
    </div>
  );
}
