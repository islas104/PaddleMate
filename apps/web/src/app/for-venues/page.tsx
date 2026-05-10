import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { VenueForm } from "./VenueForm";

const BENEFITS = [
  {
    icon: "📅",
    title: "Automated 24/7 booking",
    desc: "Players book directly through the app at any hour. No more phone calls, WhatsApp messages, or manual spreadsheets. Every booking is instantly confirmed.",
  },
  {
    icon: "🌐",
    title: "Marketplace visibility",
    desc: "Your venue is discoverable by every PaddleMate player across the UK. Fill off-peak slots, attract new members, and grow your player base automatically.",
  },
  {
    icon: "💰",
    title: "Zero commission. Ever.",
    desc: "Unlike other platforms, we charge a flat monthly fee — not a cut of your revenue. Keep 100% of every booking, no matter how busy you get.",
  },
  {
    icon: "📊",
    title: "Revenue dashboard",
    desc: "See bookings, revenue, and court utilisation at a glance. Identify your busiest slots, most popular courts, and opportunities to grow.",
  },
  {
    icon: "🤝",
    title: "Player matching",
    desc: "PaddleMate automatically fills your courts by matching players who need a game. More bookings for you, more games for them.",
  },
  {
    icon: "📱",
    title: "Web + mobile, included",
    desc: "Your venue appears on both the web platform and our iOS/Android app. Players book from whichever device they prefer.",
  },
];

const STEPS = [
  { n: "01", title: "Tell us about your venue", desc: "Fill in the form below. Takes 5 minutes. No commitment required." },
  { n: "02", title: "We set everything up", desc: "Our team configures your courts, pricing, and availability in 24 hours." },
  { n: "03", title: "Go live. Players book instantly.", desc: "Your venue appears on PaddleMate. Bookings start coming in automatically." },
];

const COMPARE = [
  { feature: "Monthly fee", us: "From €19/mo", them: "€59+/mo" },
  { feature: "Booking commission", us: "0%", them: "Up to 15%" },
  { feature: "Setup fee", us: "Free", them: "€200–500" },
  { feature: "Mobile app listing", us: "✓ Included", them: "✓ Included" },
  { feature: "Revenue dashboard", us: "✓ Included", them: "✓ Paid add-on" },
  { feature: "Player matching", us: "✓ Included", them: "✗ Not available" },
  { feature: "Contract required", us: "Cancel anytime", them: "12-month minimum" },
];

export default function ForVenuesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(22,163,74,0.2),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-800 text-brand-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            🏟️ For paddle venues & clubs
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            List your courts.<br />
            <span className="text-brand-400">Reach more players.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join the UK's growing paddle network. Get your venue on PaddleMate and let players book your courts 24/7 — with zero commission.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <a href="#get-listed" className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-brand-900/40">
              Get your venue listed →
            </a>
            <Link href="/pricing" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all">
              See pricing
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { v: "24/7", l: "Automated booking" },
              { v: "0%", l: "Commission on bookings" },
              { v: "< 24h", l: "Time to go live" },
              { v: "40%", l: "Cheaper than rivals" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-black text-brand-400">{s.v}</div>
                <div className="text-xs text-gray-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3">The old way</p>
              <h2 className="text-3xl font-black mb-6 text-white">Running a venue is harder than it should be</h2>
              <ul className="space-y-3">
                {[
                  "Managing bookings via WhatsApp and phone calls",
                  "Double-bookings from manual spreadsheets",
                  "Empty courts during off-peak hours",
                  "No visibility into revenue or utilisation",
                  "Paying 10–15% commission per booking to other platforms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-400 text-sm">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">The PaddleMate way</p>
              <h2 className="text-3xl font-black mb-6 text-white">Everything automated, zero commission</h2>
              <ul className="space-y-3">
                {[
                  "Players book online 24/7 — no admin required",
                  "Real-time availability prevents double-bookings",
                  "Player matching fills your off-peak slots automatically",
                  "Revenue and utilisation dashboard built in",
                  "Flat monthly fee — keep 100% of every booking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-brand-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-4xl font-black">Everything your venue needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-gray-900/60 border border-white/5 rounded-2xl p-6 hover:border-brand-800/50 transition-colors">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Onboarding</p>
            <h2 className="text-4xl font-black">Live in under 24 hours</h2>
          </div>
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex items-start gap-6 bg-gray-900/60 border border-white/5 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 font-black text-sm shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block ml-auto text-gray-700 text-2xl self-center">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">vs. other platforms</p>
            <h2 className="text-4xl font-black">The numbers speak for themselves</h2>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900/80 border-b border-white/10 px-6 py-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Feature</div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-wider text-center">PaddleMate</div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Others</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 px-6 py-4 ${i % 2 === 0 ? "bg-gray-900/30" : ""} border-b border-white/5 last:border-0`}>
                <div className="text-sm text-gray-400">{row.feature}</div>
                <div className="text-sm font-bold text-brand-400 text-center">{row.us}</div>
                <div className="text-sm text-gray-600 text-center">{row.them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="get-listed" className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Get started</p>
            <h2 className="text-4xl font-black mb-3">List your venue</h2>
            <p className="text-gray-400">Fill in the form and our team will have your venue live within 24 hours.</p>
          </div>
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
            <VenueForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} PaddleMate. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
          <Link href="/courts" className="hover:text-gray-400 transition-colors">Courts</Link>
        </div>
      </footer>
    </div>
  );
}
