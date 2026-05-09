import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-white">
            Paddle<span className="text-brand-400">Mate</span>
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-white/5 p-8">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{" "}
          <Link href="/signup" className="text-brand-400 hover:text-brand-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
