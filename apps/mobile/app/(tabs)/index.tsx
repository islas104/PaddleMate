import { useEffect, useState, useMemo } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, TextInput, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Search, Zap } from "lucide-react-native";

function buildDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tmrw" : new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d),
      day: new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(d),
      value: d.toISOString().split("T")[0],
    };
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const DATES = buildDates();
const TYPE_FILTERS = ["All", "Indoor", "Outdoor", "Grass", "Clay", "Hard"];

const SURFACE_ACCENT: Record<string, string> = {
  grass: "#166534",
  clay: "#9a3412",
  hard: "#1e40af",
  artificial_grass: "#15803d",
  crystal: "#164e63",
};

const SURFACE_ICON: Record<string, string> = {
  grass: "🌿",
  clay: "🟫",
  hard: "🔵",
  artificial_grass: "🟢",
  crystal: "💠",
};

export default function CourtsScreen() {
  const router = useRouter();
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [activeFilter, setActiveFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  async function fetchCourts() {
    const { data } = await supabase
      .from("courts")
      .select("*, club:clubs(id, name, city, country)")
      .eq("is_active", true);
    setCourts(data ?? []);
  }

  useEffect(() => { fetchCourts().finally(() => setLoading(false)); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchCourts();
    setRefreshing(false);
  }

  const cities = useMemo(() => {
    const cs = Array.from(new Set(courts.map((c) => c.club?.city).filter(Boolean))) as string[];
    return ["All", ...cs.sort()];
  }, [courts]);

  const filtered = useMemo(() => {
    let list = courts;
    if (cityFilter !== "All") list = list.filter((c) => c.club?.city === cityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.club?.name?.toLowerCase().includes(q) || c.club?.city?.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== "All") {
      const f = activeFilter.toLowerCase();
      if (f === "indoor" || f === "outdoor") {
        list = list.filter((c) => c.type?.toLowerCase() === f);
      } else {
        list = list.filter((c) => c.surface?.toLowerCase().replace("_", " ").includes(f));
      }
    }
    return list;
  }, [courts, search, activeFilter, cityFilter]);

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
            {/* Header */}
            <View style={s.header}>
              <View>
                <Text style={s.greeting}>{greeting()}</Text>
                <Text style={s.headerTitle}>Find a court</Text>
              </View>
              <View style={s.logoMark}>
                <Zap size={16} color={Colors.brand} strokeWidth={2.5} />
              </View>
            </View>

            {/* Search */}
            <View style={s.searchWrap}>
              <Search size={15} color={Colors.textMuted} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder="Search courts, clubs, city…"
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

            {/* City chips */}
            {cities.length > 2 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipStrip}>
                {cities.map((city) => {
                  const active = cityFilter === city;
                  return (
                    <TouchableOpacity
                      key={city}
                      style={[s.chip, active && s.chipCityActive]}
                      onPress={() => setCityFilter(city)}
                    >
                      <Text style={[s.chipText, active && s.chipCityActiveText]}>
                        {city === "All" ? "📍 All cities" : `📍 ${city}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Date strip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateStrip}>
              {DATES.map((d) => {
                const active = selectedDate === d.value;
                return (
                  <TouchableOpacity
                    key={d.value}
                    style={[s.dateChip, active && s.dateChipActive]}
                    onPress={() => setSelectedDate(d.value)}
                  >
                    <Text style={[s.dateChipLabel, active && s.dateChipLabelActive]}>{d.label}</Text>
                    <Text style={[s.dateChipDay, active && s.dateChipDayActive]}>{d.day}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Type filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipStrip}>
              {TYPE_FILTERS.map((f) => {
                const active = activeFilter === f;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[s.chip, active && s.chipTypeActive]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[s.chipText, active && s.chipTypeActiveText]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Results row */}
            <View style={s.resultsRow}>
              <View style={s.resultsDot} />
              <Text style={s.resultsLabel}>
                {filtered.length} court{filtered.length !== 1 ? "s" : ""} available
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🎾</Text>
            <Text style={s.emptyTitle}>No courts found</Text>
            <Text style={s.emptySub}>Try adjusting your search or filters</Text>
            {(search || activeFilter !== "All" || cityFilter !== "All") && (
              <TouchableOpacity
                style={s.clearFiltersBtn}
                onPress={() => { setSearch(""); setActiveFilter("All"); setCityFilter("All"); }}
              >
                <Text style={s.clearFiltersBtnText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const accent = SURFACE_ACCENT[item.surface] ?? "#1f2937";
          const surfaceIcon = SURFACE_ICON[item.surface] ?? "🎾";
          return (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push({ pathname: "/court/[id]", params: { id: item.id, date: selectedDate } } as any)}
              activeOpacity={0.83}
            >
              {/* Banner */}
              <View style={[s.cardBanner, { backgroundColor: accent }]}>
                {/* Watermark */}
                <Text style={s.bannerWatermark}>🎾</Text>
                {/* Top badges */}
                <View style={s.bannerTopRow}>
                  <View style={s.typePill}>
                    <Text style={s.typePillText}>{item.type}</Text>
                  </View>
                  <View style={s.pricePill}>
                    <Text style={s.pricePillValue}>£{item.price_per_hour}</Text>
                    <Text style={s.pricePillUnit}>/hr</Text>
                  </View>
                </View>
                {/* Name at bottom of banner */}
                <View style={s.bannerOverlay}>
                  <Text style={s.bannerCourtName} numberOfLines={1}>{item.name}</Text>
                  <Text style={s.bannerClubName} numberOfLines={1}>{item.club?.name}</Text>
                </View>
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <View style={s.cardMeta}>
                  <Text style={s.cityText}>📍 {item.club?.city}</Text>
                  <View style={[s.surfacePill, { backgroundColor: accent + "30" }]}>
                    <Text style={s.surfaceIcon}>{surfaceIcon}</Text>
                    <Text style={[s.surfacePillText, { color: Colors.brandLight }]}>
                      {item.surface?.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={s.bookBtn}
                  onPress={() => router.push({ pathname: "/court/[id]", params: { id: item.id, date: selectedDate } } as any)}
                  activeOpacity={0.8}
                >
                  <Text style={s.bookBtnText}>Book this court →</Text>
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

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 12, color: Colors.textMuted, fontWeight: "600", marginBottom: 2, letterSpacing: 0.3 },
  headerTitle: { fontSize: 30, fontWeight: "900", color: Colors.text, letterSpacing: -0.5 },
  logoMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },

  // Search
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 14, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, padding: 0 },
  clearBtn: { fontSize: 13, color: Colors.textMuted },

  // Chips (shared)
  chipStrip: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipText: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },
  chipTypeActive: { backgroundColor: "#052e16", borderColor: "#166534" },
  chipTypeActiveText: { color: Colors.brand },
  chipCityActive: { backgroundColor: Colors.surfaceHigh, borderColor: Colors.brand },
  chipCityActiveText: { color: Colors.text },

  // Date strip
  dateStrip: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  dateChip: { alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, minWidth: 60 },
  dateChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dateChipLabel: { fontSize: 10, fontWeight: "700", color: Colors.textMuted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.3 },
  dateChipLabelActive: { color: "rgba(255,255,255,0.85)" },
  dateChipDay: { fontSize: 17, fontWeight: "900", color: Colors.text },
  dateChipDayActive: { color: "#fff" },

  // Results
  resultsRow: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, paddingBottom: 10 },
  resultsDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.brand },
  resultsLabel: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },

  // Card
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardBanner: { height: 150, position: "relative", overflow: "hidden", justifyContent: "center", alignItems: "center" },
  bannerWatermark: { fontSize: 100, opacity: 0.12, position: "absolute", right: -16, bottom: -12 },
  bannerTopRow: { position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between", zIndex: 1 },
  typePill: { backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  typePillText: { color: "#e5e7eb", fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  pricePill: { backgroundColor: Colors.brand, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "baseline", gap: 1 },
  pricePillValue: { color: "#fff", fontSize: 15, fontWeight: "900" },
  pricePillUnit: { color: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: "600" },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 14, paddingVertical: 10 },
  bannerCourtName: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 1 },
  bannerClubName: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  cardBody: { padding: 14 },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  cityText: { fontSize: 13, color: Colors.textMuted, fontWeight: "500" },
  surfacePill: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  surfaceIcon: { fontSize: 12 },
  surfacePillText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bookBtn: { backgroundColor: Colors.brand, borderRadius: 14, paddingVertical: 13, alignItems: "center" },
  bookBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  // Empty
  emptyBox: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: Colors.text, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", marginBottom: 20 },
  clearFiltersBtn: { backgroundColor: Colors.surface, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.border },
  clearFiltersBtnText: { fontSize: 14, color: Colors.brand, fontWeight: "700" },
});
