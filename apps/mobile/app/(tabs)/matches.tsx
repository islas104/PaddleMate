import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("matches")
      .select(`
        *,
        booking:bookings(starts_at, ends_at, court:courts(name, club:clubs(name, city))),
        players:match_players(user_id, profile:profiles(full_name))
      `)
      .eq("status", "open")
      .eq("visibility", "public")
      .then(({ data }) => {
        setMatches(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No open matches right now.</Text>
        }
        renderItem={({ item }) => {
          const playerCount = item.players?.length ?? 0;
          const spotsLeft = item.max_players - playerCount;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/match/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.formatBadge}>
                  <Text style={styles.formatText}>{item.format}</Text>
                </View>
                <View style={[styles.spotsBadge, spotsLeft === 0 && styles.fullBadge]}>
                  <Text style={[styles.spotsText, spotsLeft === 0 && styles.fullText]}>
                    {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Full"}
                  </Text>
                </View>
              </View>
              {item.booking && (
                <Text style={styles.clubName}>{item.booking.court?.club?.name}</Text>
              )}
              <Text style={styles.level}>Level: {item.skill_level}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 60, fontSize: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  formatBadge: { backgroundColor: "#dcfce7", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  formatText: { color: "#16a34a", fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  spotsBadge: { backgroundColor: "#f0fdf4", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  spotsText: { color: "#16a34a", fontSize: 12, fontWeight: "600" },
  fullBadge: { backgroundColor: "#fef2f2" },
  fullText: { color: "#dc2626" },
  clubName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  level: { fontSize: 13, color: "#6b7280", marginTop: 4, textTransform: "capitalize" },
});
