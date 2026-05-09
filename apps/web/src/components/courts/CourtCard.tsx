import Link from "next/link";
import type { CourtWithClub } from "@paddlemate/shared";
import { formatPrice } from "@/lib/utils";

interface Props {
  court: CourtWithClub;
}

const surfaceLabel: Record<string, string> = {
  artificial_grass: "Artificial grass",
  concrete: "Concrete",
  crystal: "Crystal",
  sand: "Sand",
};

const typeLabel: Record<string, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  covered: "Covered",
};

export function CourtCard({ court }: Props) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="group block rounded-2xl bg-gray-900 border border-white/5 overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/30 transition-all duration-200"
    >
      {/* Court image / placeholder */}
      <div className="h-44 bg-gradient-to-br from-brand-950 via-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.15),transparent)]" />
        <span className="text-5xl relative z-10">🎾</span>
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-black/40 backdrop-blur-sm text-gray-300 px-2 py-1 rounded-full border border-white/10">
            {typeLabel[court.type] ?? court.type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-white text-base">{court.name}</h3>
        <p className="text-sm text-brand-400 font-medium mt-0.5">{court.club?.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{court.club?.city}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full border border-white/5">
            {surfaceLabel[court.surface] ?? court.surface}
          </span>
          <span className="text-base font-black text-brand-400">
            {formatPrice(court.price_per_hour, "GBP")}<span className="text-xs text-gray-500 font-normal">/hr</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
