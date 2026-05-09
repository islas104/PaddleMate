import Link from "next/link";
import type { MatchWithDetails } from "@paddlemate/shared";
import { formatDatetime } from "@/lib/utils";

interface Props {
  match: MatchWithDetails;
}

export function MatchCard({ match }: Props) {
  const playerCount = match.players?.length ?? 0;
  const spotsLeft = match.max_players - playerCount;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {match.format}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            spotsLeft > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Full"}
        </span>
      </div>

      {match.booking && (
        <>
          <p className="text-sm font-medium text-gray-900">
            {match.booking.court?.club?.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {match.booking.court?.club?.city}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDatetime(match.booking.starts_at)}
          </p>
        </>
      )}

      <div className="flex items-center gap-1 mt-3">
        {match.players?.slice(0, 4).map((p, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full bg-brand-200 flex items-center justify-center text-xs font-semibold text-brand-700"
          >
            {p.profile?.full_name?.[0] ?? "?"}
          </div>
        ))}
        {playerCount === 0 && (
          <span className="text-xs text-gray-400">No players yet</span>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Level: <span className="capitalize">{match.skill_level}</span>
      </p>
    </Link>
  );
}
