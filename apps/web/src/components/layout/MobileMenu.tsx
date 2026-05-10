"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/courts", label: "Courts" },
  { href: "/matches", label: "Matches" },
  { href: "/clubs", label: "Clubs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-venues", label: "For venues ↗" },
];

interface Props {
  isLoggedIn: boolean;
  initial: string;
}

export function MobileMenu({ isLoggedIn, initial }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/60 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-16 left-0 right-0 bg-gray-950 border-b border-white/10 z-50 md:hidden">
            <nav className="px-6 py-4 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center py-3.5 text-base font-semibold border-b border-white/5 last:border-0 transition-colors ${
                      active ? "text-brand-400" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-6 pb-6 pt-2">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                    {initial}
                  </span>
                  Dashboard
                </Link>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-3 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-3 bg-brand-500 hover:bg-brand-400 rounded-xl text-sm font-bold text-white transition-colors"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
