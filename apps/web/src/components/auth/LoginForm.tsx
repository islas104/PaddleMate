"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/courts";
  const serverError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(serverError ?? null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(next);
    router.refresh();
  }

  const input = "w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="••••••••" />
      </div>
      {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-400 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
