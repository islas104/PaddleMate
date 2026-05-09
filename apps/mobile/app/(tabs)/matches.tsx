import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Users, Clock, Trophy, ChevronRight } from "lucide-react-native";

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: "#052e16", text: "#4ade80", border: "#166534" },
  intermediate: { bg: "#1e1b4b", text: "#818cf8", border: "#3730a3" },
  advanced:     { bg: "#450a0a", text: "#f87171", border: "#991b1b" },
  open:         { bg: "#111827", text: "#9ca3af", border: "#374151" },
};

export default function MatchesScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;

  return (
    <View style={s.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        ListHeaderComponent={
          <View style={s.header}>
            <View style={s.headerRow}>
              <Users size={22} color={Colors.brand} strokeWidth={2.2} />
              <Text style={s.headerTitle}>Open Matches</Text>
            </View>
            <Text style={s.headerSub}>Join a game or find players for your court</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🏆</Text>
            <Text style={s.emptyTitle}>No open matches</Text>
            <Text style={s.emptySub}>Be the first to post a match after booking a court</Text>
          </View>
        }
        renderItem={({ item }) => {
          const playerCount = item.players?.length ?? 0;
          const spotsLeft = item.max_players - playerCount;
          const isFull = spotsLeft === 0;
          const lc = LEVEL_COLORS[item.skill_level] ?? LEVEL_COLORS.open;

          return (
            <TouchableOpacity style={s.card} activeOpacity={0.82}>
              {/* Header row */}
              <View style={s.cardHeader}>
                <View style={s.formatBadge}>
                  <Text style={s.formatText}>{item.format}</Text>
                </View>
                <View style={[s.spotsBadge, isFull && s.fullBadge]}>
                  <Text style={[s.spotsText, isFull && s.fullText]}>
                    {isFull ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                  </Text>
                </View>
              </View>

              {/* Venue + Time */}
              {item.booking && (
                <View style={s.venueRow}>
                  <View style={s.venueDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.venueName}>{item.booking.court?.club?.name}</Text>
                    <Text style={s.venueCity}>{item.booking.court?.club?.city} · {item.booking.court?.name}</Text>
                  </View>
                </View>
              )}

              {item.booking && (
                <View style={s.timeRow}>
                  <Clock size={13} color={Colors.brand} strokeWidth={2} />
                  <Text style={s.timeText}>
                    {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(item.booking.starts_at))}
                  </Text>
                </View>
              )}

              {/* Level + Players */}
              <View style={s.cardFooter}>
                <View style={s.levelRow}>
                  <Trophy size={12} color={lc.text} strokeWidth={2} />
                  <View style={[s.levelBadge, { backgroundColor: lc.bg, borderColor: lc.border }]}>
                    <Text style={[s.levelText, { color: lc.text }]}>{item.skill_level}</Text>
                  </View>
                </View>
                <View style={s.avatarsRow}>
                  {item.players?.slice(0, 4).map((p: any, i: number) => (
                    <View key={i} style={[s.avatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                      <Text style={s.avatarText}>{p.profile?.full_name?.[0] ?? "?"}</Text>
                    </View>
                  ))}
                  {Array.from({ length: Math.max(0, item.max_players - playerCount) }).map((_, i) => (
                    <View key={`empty-${i}`} style={[s.avatarEmpty, { marginLeft: (playerCount + i) > 0 ? -8 : 0 }]}>
                      <Text style={s.avatarEmptyText}>+</Text>
                    </View>
                  ))}
                </View>
                {!isFull && (
                  <View style={s.joinBtn}>
                    <Text style={s.joinText}>Join</Text>
                    <ChevronRight size={13} color={Colors.brand} strokeWidth={2.5} />
                  </View>
                )}
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
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  headerTitle: { fontSize: 26, fontWeight: "900", color: Colors.text },
  headerSub: { fontSize: 14, color: Colors.textMuted },
  card: { marginHorizontal: 16, marginBottom: 14, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  formatBadge: { backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#166534" },
  formatText: { color: Colors.brand, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  spotsBadge: { backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#166534" },
  spotsText: { color: Colors.brand, fontSize: 12, fontWeight: "700" },
  fullBadge: { backgroundColor: "#450a0a", borderColor: "#991b1b" },
  fullText: { color: "#f87171" },
  venueRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  venueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand, marginTop: 5 },
  venueName: { fontSize: 16, fontWeight: "700", color: Colors.text },
  venueCity: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingLeft: 18 },
  timeText: { fontSize: 13, color: Colors.brand, fontWeight: "600" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  levelBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  levelText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  avatarsRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(34,197,94,0.2)", borderWidth: 2, borderColor: Colors.surface, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 12, fontWeight: "700", color: Colors.brand },
  avatarEmpty: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.surfaceHigh, borderWidth: 2, borderColor: Colors.surface, justifyContent: "center", alignItems: "center" },
  avatarEmptyText: { fontSize: 14, color: Colors.textDim },
  joinBtn: { flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#166534" },
  joinText: { fontSize: 12, fontWeight: "700", color: Colors.brand },
  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 20 },
});
