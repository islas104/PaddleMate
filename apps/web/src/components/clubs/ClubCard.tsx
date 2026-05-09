import Link from "next/link";
import type { Club } from "@paddlemate/shared";

interface Props {
  club: Club;
}

export function ClubCard({ club }: Props) {
  return (
    <Link
      href={`/clubs/${club.id}`}
      className="group block rounded-2xl bg-gray-900 border border-white/5 overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/30 transition-all duration-200"
    >
      <div className="h-40 bg-gradient-to-br from-brand-950 via-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.15),transparent)]" />
        <span className="text-5xl relative z-10">🏟️</span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-white text-base">{club.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{club.city}, {club.country}</p>
        {club.description && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">{club.description}</p>
        )}
      </div>
    </Link>
  );
}
