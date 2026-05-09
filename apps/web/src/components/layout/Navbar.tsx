import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-white tracking-tight">
          Paddle<span className="text-brand-400">Mate</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/courts" className="text-sm text-gray-400 hover:text-white transition-colors">Courts</Link>
          <Link href="/matches" className="text-sm text-gray-400 hover:text-white transition-colors">Matches</Link>
          <Link href="/clubs" className="text-sm text-gray-400 hover:text-white transition-colors">Clubs</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-brand-500 hover:bg-brand-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
