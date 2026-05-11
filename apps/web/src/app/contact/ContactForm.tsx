"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/app/actions/leads";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await submitLead({
      type: "contact",
      name: form.name,
      email: form.email,
      subject: form.subject,
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
      <div className="bg-brand-950/60 border border-brand-800 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Message sent!</h2>
        <p className="text-gray-400 mb-6">We'll get back to you as soon as possible.</p>
        <Link href="/" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-2xl p-8 space-y-5">
      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Name</label>
          <input
            required
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email</label>
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Subject</label>
        <select
          required
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-600 transition-colors text-sm"
        >
          <option value="">Select a topic…</option>
          <option value="venue">I want to list my venue</option>
          <option value="booking">Booking question</option>
          <option value="account">Account issue</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Message</label>
        <textarea
          required
          rows={5}
          placeholder="Tell us what's on your mind…"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        {loading ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
