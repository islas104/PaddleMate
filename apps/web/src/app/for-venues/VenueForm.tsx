"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/leads";

export function VenueForm() {
  const [form, setForm] = useState({
    club_name: "", contact_name: "", email: "", phone: "", city: "", courts: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await submitLead({
      type: "venue",
      name: form.contact_name,
      email: form.email,
      phone: form.phone,
      club_name: form.club_name,
      city: form.city,
      courts: form.courts,
      message: form.message,
    });
    setLoading(false);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎾</div>
        <h3 className="text-2xl font-black text-white mb-3">We'll be in touch!</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Thanks, <span className="text-white font-semibold">{form.contact_name}</span>. Our team will reach out to <span className="text-brand-400">{form.email}</span> within 24 hours to get {form.club_name} live on PaddleMate.
        </p>
      </div>
    );
  }

  const input = "w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors text-sm";
  const label = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Club / Venue name *</label>
          <input required className={input} placeholder="Lightwood Padel Club" value={form.club_name} onChange={(e) => set("club_name", e.target.value)} />
        </div>
        <div>
          <label className={label}>Your name *</label>
          <input required className={input} placeholder="John Smith" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input required type="email" className={input} placeholder="john@yourclub.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={label}>Phone</label>
          <input className={input} placeholder="+44 7700 000000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={label}>City *</label>
          <input required className={input} placeholder="Birmingham" value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className={label}>Number of courts *</label>
          <select required className={input + " cursor-pointer"} value={form.courts} onChange={(e) => set("courts", e.target.value)}>
            <option value="">Select...</option>
            <option>1–2 courts</option>
            <option>3–5 courts</option>
            <option>6–10 courts</option>
            <option>10+ courts</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Anything else?</label>
        <textarea className={input + " resize-none h-24"} placeholder="Tell us about your venue, current booking setup, or any questions..." value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-black py-4 rounded-xl text-base transition-colors shadow-lg shadow-brand-900/40"
      >
        {loading ? "Sending..." : "Get your venue listed →"}
      </button>
      <p className="text-center text-xs text-gray-600">No commitment. Our team will contact you within 24 hours.</p>
    </form>
  );
}
