import type { Database } from "./database.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = any;

// Courts
export async function getCourts(client: Client, city?: string) {
  let query = client
    .from("courts")
    .select("*, club:clubs(id, name, address, city, logo_url)")
    .eq("is_active", true);

  if (city) {
    query = query.eq("clubs.city", city);
  }

  return query;
}

export async function getCourtById(client: Client, courtId: string) {
  return client
    .from("courts")
    .select("*, club:clubs(id, name, address, city, country, phone, logo_url)")
    .eq("id", courtId)
    .single();
}

// Bookings
export async function getBookingsByUser(client: Client, userId: string) {
  return client
    .from("bookings")
    .select("*, court:courts(id, name, club:clubs(id, name, address, city))")
    .eq("user_id", userId)
    .order("starts_at", { ascending: false });
}

export async function getCourtAvailability(
  client: Client,
  courtId: string,
  date: string
) {
  const start = `${date}T00:00:00`;
  const end = `${date}T23:59:59`;

  return client
    .from("bookings")
    .select("starts_at, ends_at")
    .eq("court_id", courtId)
    .gte("starts_at", start)
    .lte("ends_at", end)
    .not("status", "eq", "cancelled");
}

export async function createBooking(
  client: Client,
  booking: Database["public"]["Tables"]["bookings"]["Insert"]
) {
  return client.from("bookings").insert(booking).select().single();
}

// Matches
export async function getOpenMatches(client: Client) {
  return client
    .from("matches")
    .select(
      `*,
      booking:bookings(starts_at, ends_at, court:courts(id, name, club:clubs(id, name, city))),
      players:match_players(user_id, profile:profiles(full_name, avatar_url, skill_level))`
    )
    .eq("status", "open")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });
}

export async function joinMatch(client: Client, matchId: string, userId: string) {
  return client.from("match_players").insert({ match_id: matchId, user_id: userId });
}

// Clubs
export async function getClubs(client: Client) {
  return client.from("clubs").select("*").eq("is_active", true);
}

export async function getClubById(client: Client, clubId: string) {
  return client
    .from("clubs")
    .select("*, courts(*), members:club_members(*, profile:profiles(full_name, avatar_url))")
    .eq("id", clubId)
    .single();
}

// Profile
export async function getProfile(client: Client, userId: string) {
  return client.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(
  client: Client,
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"]
) {
  return client.from("profiles").update(updates).eq("id", userId).select().single();
}
