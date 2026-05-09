import Link from "next/link";
import Image from "next/image";
import type { Club } from "@paddlemate/shared";

interface Props {
  club: Club;
}

export function ClubCard({ club }: Props) {
  return (
    <Link
      href={`/clubs/${club.id}`}
      className="block rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <div className="h-36 bg-brand-50 flex items-center justify-center">
        {club.logo_url ? (
          <Image src={club.logo_url} alt={club.name} width={80} height={80} className="object-contain" />
        ) : (
          <span className="text-4xl">🏟️</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{club.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {club.city}, {club.country}
        </p>
        {club.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{club.description}</p>
        )}
      </div>
    </Link>
  );
}
