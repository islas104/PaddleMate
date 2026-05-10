import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, TouchableOpacity, ScrollView,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Users, Clock, Trophy, MapPin } from "lucide-react-native";

const LEVEL_FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "Open"];

const LEVEL_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: "#052e16", text: "#4ade80", border: "#166534" },
  intermediate: { bg: "#1e1b4b", text: "#818cf8", border: "#3730a3" },
  advanced:     { bg: "#450a0a", text: "#f87171", border: "#991b1b" },
  open:         { bg: "#1c1917", text: "#a8a29e", border: "#44403c" },
};

export default function MatchesScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [levelFilter, setLevelFilter] = useState("All");

  async function fetchMatches() {
    const { data } = await supabase
      .from("matches")
      .select("*, booking:bookings(starts_at, ends_at, court:courts(name, club:clubs(name, city))), players:match_players(user_id, profile:profiles(full_name))")
      .eq("status", "open")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });
    setMatches(data ?? []);
  }

  useEffect(() => { fetchMatches().finally(() => setLoading(false)); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  }

  const filtered = levelFilter === "All"
    ? matches
    : matches.filter((m) => m.skill_level?.toLowerCase() === levelFilter.toLowerCase());

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;

  return (
    <View style={s.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        ListHeaderComponent={
          <View>
            <View style={s.header}>
              <View style={s.headerLeft}>
                <Text style={s.headerTitle}>Open Matches</Text>
                <Text style={s.headerSub}>Find a game · Join a team</Text>
              </View>
              <View style={s.countBadge}>
                <Users size={13} color={Colors.brand} strokeWidth={2.5} />
                <Text style={s.countText}>{filtered.length}</Text>
              </View>
            </View>

            {/* Level filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterStrip}>
              {LEVEL_FILTERS.map((f) => {
                const active = levelFilter === f;
                const ls = LEVEL_STYLE[f.toLowerCase()];
                return (
                  <TouchableOpacity
                    key={f}
                    style={[s.filterChip, active && ls && { backgroundColor: ls.bg, borderColor: ls.border }, active && !ls && s.filterChipActive]}
                    onPress={() => setLevelFilter(f)}
                  >
                    <Text style={[s.filterChipText, active && ls && { color: ls.text }, active && !ls && { color: Colors.brand }]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🏆</Text>
            <Text style={s.emptyTitle}>No open matches</Text>
            <Text style={s.emptySub}>Be the first — book a court and post a match</Text>
          </View>
        }
        renderItem={({ item }) => {
          const playerCount = item.players?.length ?? 0;
          const spotsLeft = item.max_players - playerCount;
          const isFull = spotsLeft === 0;
          const ls = LEVEL_STYLE[item.skill_level?.toLowerCase()] ?? LEVEL_STYLE.open;
          const filledPct = playerCount / item.max_players;

          return (
            <TouchableOpacity style={s.card} activeOpacity={0.82}>
              {/* Top row */}
              <View style={s.cardTop}>
                <View style={[s.formatBadge]}>
                  <Text style={s.formatText}>{item.format}</Text>
                </View>
                <View style={[s.levelBadge, { backgroundColor: ls.bg, borderColor: ls.border }]}>
                  <Trophy size={10} color={ls.text} strokeWidth={2} />
                  <Text style={[s.levelText, { color: ls.text }]}>{item.skill_level}</Text>
                </View>
                <View style={[s.spotsBadge, isFull && s.fullBadge]}>
                  <Text style={[s.spotsText, isFull && s.fullText]}>
                    {isFull ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""}`}
                  </Text>
                </View>
              </View>

              {/* Venue */}
              {item.booking && (
                <View style={s.venueBox}>
                  <View style={s.venueLeft}>
                    <MapPin size={13} color={Colors.brand} strokeWidth={2} />
                    <View>
                      <Text style={s.venueName}>{item.booking.court?.club?.name}</Text>
                      <Text style={s.venueCity}>{item.booking.court?.club?.city}</Text>
                    </View>
                  </View>
                  <View style={s.timeBox}>
                    <Clock size={12} color={Colors.brand} strokeWidth={2} />
                    <Text style={s.timeText}>
                      {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(item.booking.starts_at))}
                    </Text>
                  </View>
                </View>
              )}

              {/* Players + progress */}
              <View style={s.playersRow}>
                <View style={s.avatars}>
                  {item.players?.slice(0, 4).map((p: any, i: number) => (
                    <View key={i} style={[s.avatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 4 - i }]}>
                      <Text style={s.avatarText}>{p.profile?.full_name?.[0] ?? "?"}</Text>
                    </View>
                  ))}
                  {Array.from({ length: Math.min(item.max_players - playerCount, 4 - Math.min(playerCount, 4)) }).map((_, i) => (
                    <View key={`e${i}`} style={[s.avatarEmpty, { marginLeft: -10, zIndex: 0 }]}>
                      <Text style={s.avatarEmptyIcon}>+</Text>
                    </View>
                  ))}
                  <Text style={s.playerCountText}>{playerCount}/{item.max_players}</Text>
                </View>

                {!isFull && (
                  <TouchableOpacity style={s.joinBtn}>
                    <Text style={s.joinBtnText}>Join match</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Fill bar */}
              <View style={s.fillBarBg}>
                <View style={[s.fillBar, { width: `${Math.round(filledPct * 100)}%` as any, backgroundColor: isFull ? "#ef4444" : Colors.brand }]} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },
  list: { paddingBottom: 32 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerLeft: {},
  headerTitle: { fontSize: 30, fontWeight: "900", color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 3 },
  countBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: "#166534" },
  countText: { fontSize: 14, fontWeight: "800", color: Colors.brand },

  filterStrip: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: "#052e16", borderColor: "#166534" },
  filterChipText: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },

  card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 14 },
  cardTop: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  formatBadge: { backgroundColor: Colors.surfaceHigh, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  formatText: { color: Colors.textMuted, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  levelBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  levelText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  spotsBadge: { marginLeft: "auto" as any, backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#166534" },
  spotsText: { color: Colors.brand, fontSize: 12, fontWeight: "700" },
  fullBadge: { backgroundColor: "#450a0a", borderColor: "#991b1b" },
  fullText: { color: "#f87171" },

  venueBox: { backgroundColor: Colors.surfaceHigh, borderRadius: 14, padding: 12, gap: 8 },
  venueLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  venueName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  venueCity: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  timeBox: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  timeText: { fontSize: 12, color: Colors.brand, fontWeight: "600" },

  playersRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatars: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(34,197,94,0.2)", borderWidth: 2, borderColor: Colors.surface, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 12, fontWeight: "800", color: Colors.brand },
  avatarEmpty: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceHigh, borderWidth: 2, borderColor: Colors.surface, justifyContent: "center", alignItems: "center" },
  avatarEmptyIcon: { fontSize: 14, color: Colors.textDim },
  playerCountText: { fontSize: 12, color: Colors.textMuted, fontWeight: "600", marginLeft: 10 },
  joinBtn: { backgroundColor: Colors.brand, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10 },
  joinBtnText: { color: "#fff", fontSize: 13, fontWeight: "800" },

  fillBarBg: { height: 4, backgroundColor: Colors.surfaceHigh, borderRadius: 2, overflow: "hidden" },
  fillBar: { height: 4, borderRadius: 2 },

  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 20 },
});
