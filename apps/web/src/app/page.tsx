import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
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
            <Link href="/courts" className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-brand-900/50">
              Book a court →
            </Link>
            <Link href="/matches" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all">
              Find a match
            </Link>
          </div>

          {/* Venue CTA */}
          <div className="mt-8">
            <Link href="/for-venues" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors">
              🏟️ Own a paddle venue? <span className="text-brand-400 font-semibold underline underline-offset-2">List your courts for free →</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 mt-20">
            {[
              { value: "24/7", label: "Court access" },
              { value: "40%", label: "Cheaper than rivals" },
              { value: "All levels", label: "Player matching" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-brand-400">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-black">Up and playing in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-brand-800/0 via-brand-700/50 to-brand-800/0" />

            {[
              { step: "01", icon: "🔍", title: "Find a court", desc: "Search courts by location, surface type, and price. See real-time availability." },
              { step: "02", icon: "📅", title: "Pick a slot", desc: "Choose your date and time. Taken slots are shown instantly — no surprises." },
              { step: "03", icon: "🎾", title: "Play", desc: "Show up and play. Your booking is confirmed and saved to your dashboard." },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/5 flex items-center justify-center text-3xl mx-auto mb-5 relative z-10">
                  {s.icon}
                </div>
                <span className="text-xs font-black text-brand-600 uppercase tracking-widest">{s.step}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎾", title: "Book Courts", desc: "Search available courts near you, pick a time slot, and confirm instantly.", color: "from-brand-950 to-brand-900/50 border-brand-800/50" },
            { icon: "🤝", title: "Find Players", desc: "Get matched with players at your skill level. No more WhatsApp group chaos.", color: "from-blue-950 to-blue-900/50 border-blue-800/50" },
            { icon: "🏟️", title: "Club Tools", desc: "Clubs get a full dashboard to manage courts, members, and bookings.", color: "from-purple-950 to-purple-900/50 border-purple-800/50" },
          ].map((f) => (
            <div key={f.title} className={`rounded-2xl bg-gradient-to-b ${f.color} border p-6`}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For venues CTA */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="rounded-2xl border border-brand-800/40 bg-gradient-to-br from-brand-950/60 to-gray-900/60 p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-950 border border-brand-800 text-brand-400 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
                🏟️ For venue owners
              </div>
              <h2 className="text-4xl font-black mb-4 text-white">List your courts.<br />Zero commission.</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Join the UK's fastest-growing paddle marketplace. Players discover your courts, book instantly, and pay online — while you keep 100% of every booking.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/for-venues" className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Get your venue listed →
                </Link>
                <Link href="/pricing" className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  See pricing
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⚡", label: "Live in under 24h" },
                { icon: "💰", label: "0% commission" },
                { icon: "📅", label: "24/7 automated booking" },
                { icon: "📊", label: "Revenue dashboard" },
                { icon: "🤝", label: "Player matching" },
                { icon: "📱", label: "iOS & Android app" },
              ].map((f) => (
                <div key={f.label} className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm text-gray-300 font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl font-black mb-4">Up to 40% cheaper.<br />Zero compromise.</h2>
          <p className="text-gray-400 mb-8">Plans starting from <span className="text-white font-bold">£19/month</span> — no setup fees, cancel anytime.</p>
          <Link href="/pricing" className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            See all plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-gray-900/20">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-lg mb-2">PaddleMate</p>
            <p className="text-gray-500 text-sm leading-relaxed">The UK's smarter padel booking platform.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Players</p>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/courts" className="hover:text-brand-400 transition-colors">Browse courts</Link></li>
              <li><Link href="/clubs" className="hover:text-brand-400 transition-colors">Find clubs</Link></li>
              <li><Link href="/matches" className="hover:text-brand-400 transition-colors">Join a match</Link></li>
              <li><Link href="/signup" className="hover:text-brand-400 transition-colors">Create account</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Venues</p>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/for-venues" className="hover:text-brand-400 transition-colors">List your courts</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Company</p>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-5 text-center text-gray-700 text-xs">
          © {new Date().getFullYear()} PaddleMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
