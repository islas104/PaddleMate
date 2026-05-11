import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl mb-6">🎾</div>
      <h1 className="text-6xl font-black text-brand-400 mb-3">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page not found</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Looks like this court doesn't exist. Let's get you back on the right one.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/courts"
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Browse courts
        </Link>
      </div>
    </div>
  );
}
