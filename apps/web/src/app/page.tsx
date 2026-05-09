import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(22,163,74,0.25),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-800 text-brand-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            🎾 The smarter way to play paddle
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Book courts.{" "}
            <span className="text-brand-400">Find players.</span>
            <br />
            Own the court.
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            PaddleMate makes it effortless to book courts, get matched with players at your level, and manage your club — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courts"
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-brand-900/50 hover:shadow-brand-500/30"
            >
              Book a court →
            </Link>
            <Link
              href="/matches"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
            >
              Find a match
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 mt-20 text-center">
            {[
              { value: "24/7", label: "Court access" },
              { value: "40%", label: "Cheaper than rivals" },
              { value: "All levels", label: "Player matching" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-black text-brand-400">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎾",
              title: "Book Courts",
              desc: "Search available courts near you, pick a time slot, and confirm instantly.",
              color: "from-brand-950 to-brand-900/50 border-brand-800/50",
            },
            {
              icon: "🤝",
              title: "Find Players",
              desc: "Get matched with players at your skill level. No more WhatsApp group chaos.",
              color: "from-blue-950 to-blue-900/50 border-blue-800/50",
            },
            {
              icon: "🏟️",
              title: "Club Tools",
              desc: "Clubs get a full dashboard to manage courts, members, and bookings.",
              color: "from-purple-950 to-purple-900/50 border-purple-800/50",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl bg-gradient-to-b ${f.color} border p-6`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl font-black mb-4">Up to 40% cheaper.<br />Zero compromise.</h2>
          <p className="text-gray-400 mb-8">Plans starting from <span className="text-white font-bold">€19/month</span> — no setup fees, cancel anytime.</p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            See all plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} PaddleMate. All rights reserved.
      </footer>
    </div>
  );
}
