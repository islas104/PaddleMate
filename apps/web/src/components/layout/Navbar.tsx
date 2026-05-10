import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { full_name: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    profile = data as any;
  }

  const initial = profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-white tracking-tight shrink-0">
          Paddle<span className="text-brand-400">Mate</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/courts" className="text-sm text-gray-400 hover:text-white transition-colors">Courts</Link>
          <Link href="/matches" className="text-sm text-gray-400 hover:text-white transition-colors">Matches</Link>
          <Link href="/clubs" className="text-sm text-gray-400 hover:text-white transition-colors">Clubs</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/for-venues" className="text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            For venues ↗
          </Link>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-sm font-black text-white hover:bg-brand-400 transition-colors"
                title={profile?.full_name ?? user.email}
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-brand-500 hover:bg-brand-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu isLoggedIn={!!user} initial={initial} />
      </div>
    </nav>
  );
}
