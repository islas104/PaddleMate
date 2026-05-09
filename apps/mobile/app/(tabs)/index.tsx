import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Zap, ChevronRight } from "lucide-react-native";

const SURFACE_COLORS: Record<string, { bg: string; text: string }> = {
  grass:    { bg: "#052e16", text: "#4ade80" },
  clay:     { bg: "#431407", text: "#fb923c" },
  hard:     { bg: "#1e1b4b", text: "#818cf8" },
  artificial_grass: { bg: "#052e16", text: "#86efac" },
};

export default function CourtsScreen() {
  const router = useRouter();
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchCourts() {
    const { data } = await supabase
      .from("courts")
      .select("*, club:clubs(id, name, city)")
      .eq("is_active", true);
    setCourts(data ?? []);
  }

  useEffect(() => { fetchCourts().finally(() => setLoading(false)); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchCourts();
    setRefreshing(false);
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;

  return (
    <View style={s.container}>
      <FlatList
        data={courts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        ListHeaderComponent={
          <View style={s.header}>
            <View style={s.headerRow}>
              <View style={s.logoWrap}>
                <Zap size={18} color={Colors.brand} strokeWidth={2.5} />
              </View>
              <Text style={s.logo}>PaddleMate</Text>
            </View>
            <Text style={s.headerTitle}>Find a court</Text>
            <Text style={s.headerSub}>Book paddle courts near you instantly</Text>
            {courts.length > 0 && (
              <View style={s.countBadge}>
                <Text style={s.countText}>{courts.length} courts available</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🎾</Text>
            <Text style={s.emptyTitle}>No courts yet</Text>
            <Text style={s.emptySub}>Clubs are being onboarded — check back soon</Text>
          </View>
        }
        renderItem={({ item }) => {
          const sc = SURFACE_COLORS[item.surface] ?? SURFACE_COLORS.hard;
          return (
            <TouchableOpacity style={s.card} onPress={() => router.push(`/court/${item.id}` as any)} activeOpacity={0.8}>
              <View style={s.cardBanner}>
                <Text style={s.cardEmoji}>🎾</Text>
                <View style={[s.typePill, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
                  <Text style={s.typePillText}>{item.type}</Text>
                </View>
                <View style={s.priceBadge}>
                  <Text style={s.priceValue}>£{item.price_per_hour}</Text>
                  <Text style={s.priceUnit}>/hr</Text>
                </View>
              </View>

              <View style={s.cardBody}>
                <View style={s.cardMain}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{item.name}</Text>
                    <Text style={s.cardClub}>{item.club?.name}</Text>
                    <Text style={s.cardCity}>📍 {item.club?.city}</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.textDim} />
                </View>
                <View style={s.cardPills}>
                  <View style={[s.surfacePill, { backgroundColor: sc.bg }]}>
                    <Text style={[s.surfacePillText, { color: sc.text }]}>
                      {item.surface?.replace("_", " ")}
                    </Text>
                  </View>
                  <View style={s.bookNowPill}>
                    <Text style={s.bookNowText}>Book now →</Text>
                  </View>
                </View>
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
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  logoWrap: { width: 30, height: 30, borderRadius: 9, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },
  logo: { fontSize: 15, fontWeight: "800", color: Colors.brand, letterSpacing: 0.3 },
  headerTitle: { fontSize: 30, fontWeight: "900", color: Colors.text, marginBottom: 4 },
  headerSub: { fontSize: 14, color: Colors.textMuted, marginBottom: 14 },
  countBadge: { alignSelf: "flex-start", backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#166534" },
  countText: { fontSize: 12, fontWeight: "700", color: Colors.brand },
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardBanner: { height: 150, backgroundColor: "#052e16", alignItems: "center", justifyContent: "center", position: "relative" },
  cardEmoji: { fontSize: 56 },
  typePill: { position: "absolute", top: 12, left: 12, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  typePillText: { color: "#d1d5db", fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  priceBadge: { position: "absolute", top: 12, right: 12, backgroundColor: Colors.brand, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "baseline", gap: 1 },
  priceValue: { color: "#fff", fontSize: 17, fontWeight: "900" },
  priceUnit: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "600" },
  cardBody: { padding: 16, gap: 12 },
  cardMain: { flexDirection: "row", alignItems: "center" },
  cardName: { fontSize: 18, fontWeight: "800", color: Colors.text, marginBottom: 3 },
  cardClub: { fontSize: 13, color: Colors.brand, fontWeight: "600", marginBottom: 3 },
  cardCity: { fontSize: 12, color: Colors.textMuted },
  cardPills: { flexDirection: "row", gap: 8 },
  surfacePill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  surfacePillText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bookNowPill: { backgroundColor: Colors.surfaceHigh, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  bookNowText: { fontSize: 11, fontWeight: "700", color: Colors.textMuted },
  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 20 },
});
