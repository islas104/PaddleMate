import { useEffect, useState, useMemo } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, ChevronRight, Search } from "lucide-react-native";

const CLUB_ACCENTS = ["#166534", "#1e40af", "#7c2d12", "#4c1d95", "#0e7490", "#854d0e"];

export default function ClubsScreen() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  async function fetchClubs() {
    const { data } = await supabase
      .from("clubs")
      .select("*, courts(count)")
      .eq("is_active", true);
    setClubs(data ?? []);
  }

  useEffect(() => { fetchClubs().finally(() => setLoading(false)); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchClubs();
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return clubs;
    const q = search.toLowerCase();
    return clubs.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q)
    );
  }, [clubs, search]);

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
              <Text style={s.headerTitle}>Clubs</Text>
              <Text style={s.headerSub}>Venues partnered with PaddleMate</Text>
            </View>
            <View style={s.searchWrap}>
              <Search size={15} color={Colors.textMuted} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder="Search clubs or city…"
                placeholderTextColor={Colors.textDim}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Text style={s.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {filtered.length > 0 && (
              <View style={s.resultsRow}>
                <View style={s.resultsDot} />
                <Text style={s.resultsLabel}>{filtered.length} venue{filtered.length !== 1 ? "s" : ""}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🏟️</Text>
            <Text style={s.emptyTitle}>{search ? "No clubs found" : "No clubs yet"}</Text>
            <Text style={s.emptySub}>{search ? "Try a different search" : "We're onboarding venues — check back soon"}</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const accent = CLUB_ACCENTS[index % CLUB_ACCENTS.length];
          const courtCount = item.courts?.[0]?.count ?? 0;
          return (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push(`/club/${item.id}` as any)}
              activeOpacity={0.83}
            >
              {/* Banner */}
              <View style={[s.cardBanner, { backgroundColor: accent }]}>
                <Text style={s.bannerWatermark}>🏟️</Text>
                {courtCount > 0 && (
                  <View style={s.courtCountBadge}>
                    <Text style={s.courtCountText}>{courtCount} court{courtCount !== 1 ? "s" : ""}</Text>
                  </View>
                )}
                <View style={s.bannerOverlay}>
                  <Text style={s.bannerName}>{item.name}</Text>
                </View>
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <View style={s.bodyRow}>
                  <View style={s.locationRow}>
                    <MapPin size={12} color={Colors.textMuted} strokeWidth={2} />
                    <Text style={s.locationText}>{item.city}{item.country ? `, ${item.country}` : ""}</Text>
                  </View>
                  {item.description ? (
                    <Text style={s.desc} numberOfLines={1}>{item.description}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={s.viewBtn}
                  onPress={() => router.push(`/club/${item.id}` as any)}
                  activeOpacity={0.8}
                >
                  <Text style={s.viewBtnText}>View venue</Text>
                  <ChevronRight size={15} color={Colors.brand} strokeWidth={2.5} />
                </TouchableOpacity>
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

  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 14 },
  headerTitle: { fontSize: 30, fontWeight: "900", color: Colors.text, letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, color: Colors.textMuted },

  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 10, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, padding: 0 },
  clearBtn: { fontSize: 13, color: Colors.textMuted },

  resultsRow: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, paddingBottom: 10 },
  resultsDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.brand },
  resultsLabel: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },

  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardBanner: { height: 130, position: "relative", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  bannerWatermark: { fontSize: 90, opacity: 0.12, position: "absolute" },
  courtCountBadge: { position: "absolute", top: 12, right: 12, backgroundColor: Colors.brand, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  courtCountText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 14, paddingVertical: 10 },
  bannerName: { fontSize: 16, fontWeight: "800", color: "#fff" },

  cardBody: { padding: 14 },
  bodyRow: { marginBottom: 12 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  locationText: { fontSize: 13, color: Colors.textMuted, fontWeight: "500" },
  desc: { fontSize: 13, color: Colors.textMuted, lineHeight: 18 },

  viewBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#052e16", borderRadius: 14, borderWidth: 1, borderColor: "#166534", paddingVertical: 12 },
  viewBtnText: { fontSize: 14, fontWeight: "800", color: Colors.brand },

  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 20 },
});
