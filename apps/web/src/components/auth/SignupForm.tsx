"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignupFormInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/courts";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-white mb-2">Check your email</p>
        <p className="text-gray-400 text-sm">We sent a confirmation link to <span className="text-brand-400">{email}</span>. Click it to activate your account.</p>
      </div>
    );
  }

  const input = "w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={input} placeholder="Your name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="Min. 8 characters" />
      </div>
      {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-400 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function SignupForm() {
  return (
    <Suspense fallback={null}>
      <SignupFormInner />
    </Suspense>
  );
}
