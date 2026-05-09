export type MatchFormat = "singles" | "doubles";
export type MatchStatus = "open" | "full" | "completed" | "cancelled";
export type MatchVisibility = "public" | "private";

export interface Match {
  id: string;
  booking_id: string | null;
  organizer_id: string;
  format: MatchFormat;
  skill_level: string;
  status: MatchStatus;
  visibility: MatchVisibility;
  max_players: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  user_id: string;
  joined_at: string;
}

export interface MatchWithDetails extends Match {
  booking: {
    court: {
      id: string;
      name: string;
      club: { id: string; name: string; city: string };
    };
    starts_at: string;
    ends_at: string;
  } | null;
  players: Array<{
    user_id: string;
    profile: { full_name: string; avatar_url: string | null; skill_level: string };
  }>;
}

export interface MatchCreate {
  booking_id?: string;
  format: MatchFormat;
  skill_level: string;
  visibility?: MatchVisibility;
  max_players: number;
  description?: string;
}
