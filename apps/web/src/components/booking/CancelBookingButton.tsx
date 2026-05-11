"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  async function handleCancel() {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    const supabase = createClient();
    await (supabase.from("bookings") as any).update({ status: "cancelled" }).eq("id", bookingId);
    setDone(true);
    setTimeout(() => router.refresh(), 1200);
  }

  if (done) {
    return (
      <span className="text-xs px-3 py-1.5 rounded-lg border border-brand-800 bg-brand-950/50 text-brand-400">
        Cancelled ✓
      </span>
    );
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        confirm
          ? "border-red-700 bg-red-950/50 text-red-400 hover:bg-red-900/50"
          : "border-white/10 text-gray-500 hover:text-red-400 hover:border-red-800"
      }`}
    >
      {loading ? "Cancelling…" : confirm ? "Tap to confirm" : "Cancel"}
    </button>
  );
}
