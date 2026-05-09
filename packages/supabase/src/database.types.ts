export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          skill_level: "beginner" | "intermediate" | "advanced" | "professional";
          location: string | null;
          bio: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string;
          city: string;
          country: string;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          cover_url: string | null;
          owner_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clubs"]["Row"], "id" | "created_at" | "updated_at" | "is_active">;
        Update: Partial<Database["public"]["Tables"]["clubs"]["Insert"]>;
      };
      courts: {
        Row: {
          id: string;
          club_id: string;
          name: string;
          surface: "artificial_grass" | "concrete" | "crystal" | "sand";
          type: "indoor" | "outdoor" | "covered";
          is_active: boolean;
          price_per_hour: number;
          currency: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["courts"]["Row"], "id" | "created_at" | "updated_at" | "is_active" | "currency">;
        Update: Partial<Database["public"]["Tables"]["courts"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          court_id: string;
          user_id: string;
          starts_at: string;
          ends_at: string;
          duration_minutes: number;
          total_price: number;
          currency: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          payment_status: "unpaid" | "paid" | "refunded";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at" | "updated_at" | "status" | "payment_status" | "currency">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          booking_id: string | null;
          organizer_id: string;
          format: "singles" | "doubles";
          skill_level: string;
          status: "open" | "full" | "completed" | "cancelled";
          visibility: "public" | "private";
          max_players: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at" | "updated_at" | "status">;
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      match_players: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["match_players"]["Row"], "id" | "joined_at">;
        Update: never;
      };
      club_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          joined_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["club_members"]["Row"], "id" | "joined_at">;
        Update: Partial<Pick<Database["public"]["Tables"]["club_members"]["Row"], "role">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
