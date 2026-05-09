import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-brand-600">PaddleMate</span>
        <div className="flex items-center gap-4">
          <Link href="/courts" className="text-sm text-gray-600 hover:text-gray-900">
            Courts
          </Link>
          <Link href="/matches" className="text-sm text-gray-600 hover:text-gray-900">
            Matches
          </Link>
          <Link href="/clubs" className="text-sm text-gray-600 hover:text-gray-900">
            Clubs
          </Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Paddle sports,{" "}
          <span className="text-brand-600">simplified.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Book courts instantly, find players at your level, and manage your club — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/courts"
            className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            Book a court
          </Link>
          <Link
            href="/matches"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Find a match
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: "🎾",
            title: "Book Courts",
            desc: "Search available courts near you, pick a time slot, and confirm instantly.",
          },
          {
            icon: "🤝",
            title: "Find Players",
            desc: "Get matched with players at your skill level. No more WhatsApp groups.",
          },
          {
            icon: "🏟️",
            title: "Club Tools",
            desc: "Clubs get a full dashboard to manage courts, members, and bookings.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
