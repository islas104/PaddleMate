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

export function CourtCard({ court }: Props) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="block rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <div className="h-40 bg-brand-100 flex items-center justify-center text-4xl">
        🎾
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{court.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{court.club?.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{court.club?.city}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {surfaceLabel[court.surface] ?? court.surface}
          </span>
          <span className="text-sm font-semibold text-brand-600">
            {formatPrice(court.price_per_hour)}/hr
          </span>
        </div>
      </div>
    </Link>
  );
}
