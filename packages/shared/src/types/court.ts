export type CourtSurface = "artificial_grass" | "concrete" | "crystal" | "sand";
export type CourtType = "indoor" | "outdoor" | "covered";

export interface Court {
  id: string;
  club_id: string;
  name: string;
  surface: CourtSurface;
  type: CourtType;
  is_active: boolean;
  price_per_hour: number;
  currency: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourtWithClub extends Court {
  club: {
    id: string;
    name: string;
    address: string;
    city: string;
    logo_url: string | null;
  };
}

export interface CourtCreate {
  club_id: string;
  name: string;
  surface: CourtSurface;
  type: CourtType;
  price_per_hour: number;
  currency?: string;
}
