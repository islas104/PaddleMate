"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Get in touch</p>
          <h1 className="text-4xl font-black mb-3">Contact us</h1>
          <p className="text-gray-400">
            Have a question or want to list your venue? We typically reply within 24 hours.
          </p>
        </div>

        {sent ? (
          <div className="bg-brand-950/60 border border-brand-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Message sent!</h2>
            <p className="text-gray-400 mb-6">We'll get back to you as soon as possible.</p>
            <Link href="/" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              ← Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Subject</label>
              <select
                required
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
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-5">
            <p className="text-xl mb-2">🏟️</p>
            <p className="font-bold text-sm mb-1">List your venue</p>
            <p className="text-gray-500 text-xs">Want to get your courts on PaddleMate? Fill in the form above or visit our</p>
            <Link href="/for-venues" className="text-brand-400 text-xs hover:text-brand-300 transition-colors">venues page →</Link>
          </div>
          <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-5">
            <p className="text-xl mb-2">💬</p>
            <p className="font-bold text-sm mb-1">Response time</p>
            <p className="text-gray-500 text-xs">We aim to reply to all enquiries within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
