import { useEffect, useState, useMemo } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, TextInput, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Search, SlidersHorizontal, Zap } from "lucide-react-native";

// ─── Date strip helpers ──────────────────────────────────────────────────────
function buildDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d),
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
  artificial_grass: "#166534",
  crystal: "#164e63",
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
    if (cityFilter !== "All") {
      list = list.filter((c) => c.club?.city === cityFilter);
    }
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
            {/* Top header */}
            <View style={s.header}>
              <View>
                <Text style={s.greeting}>{greeting()}</Text>
                <Text style={s.headerTitle}>Find a court</Text>
              </View>
              <View style={s.logoMark}>
                <Zap size={16} color={Colors.brand} strokeWidth={2.5} />
              </View>
            </View>

            {/* Search bar */}
            <View style={s.searchWrap}>
              <Search size={16} color={Colors.textMuted} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder="Search courts, clubs, city..."
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterStrip}>
                {cities.map((city) => {
                  const active = cityFilter === city;
                  return (
                    <TouchableOpacity
                      key={city}
                      style={[s.filterChip, active && s.cityChipActive]}
                      onPress={() => setCityFilter(city)}
                    >
                      <Text style={[s.filterChipText, active && s.cityChipTextActive]}>
                        {city === "All" ? "📍 All cities" : `📍 ${city}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Date strip */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.dateStrip}
            >
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

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filterStrip}
            >
              {TYPE_FILTERS.map((f) => {
                const active = activeFilter === f;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[s.filterChip, active && s.filterChipActive]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[s.filterChipText, active && s.filterChipTextActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Results label */}
            <View style={s.resultsRow}>
              <Text style={s.resultsLabel}>
                {filtered.length} court{filtered.length !== 1 ? "s" : ""} available
              </Text>
              <SlidersHorizontal size={14} color={Colors.textDim} strokeWidth={2} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🎾</Text>
            <Text style={s.emptyTitle}>No courts found</Text>
            <Text style={s.emptySub}>Try adjusting your search or filters</Text>
            {(search || activeFilter !== "All" || cityFilter !== "All") && (
              <TouchableOpacity style={s.clearFiltersBtn} onPress={() => { setSearch(""); setActiveFilter("All"); setCityFilter("All"); }}>
                <Text style={s.clearFiltersBtnText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const accent = SURFACE_ACCENT[item.surface] ?? "#1f2937";
          return (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push({ pathname: "/court/[id]", params: { id: item.id, date: selectedDate } } as any)}
              activeOpacity={0.82}
            >
              {/* Banner */}
              <View style={[s.cardBanner, { backgroundColor: accent }]}>
                <Text style={s.cardEmoji}>🎾</Text>
                <View style={s.bannerTopRow}>
                  <View style={s.typePill}>
                    <Text style={s.typePillText}>{item.type}</Text>
                  </View>
                  <View style={s.pricePill}>
                    <Text style={s.pricePillValue}>£{item.price_per_hour}</Text>
                    <Text style={s.pricePillUnit}>/hr</Text>
                  </View>
                </View>
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <View style={s.cardBodyTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.courtName}>{item.name}</Text>
                    <Text style={s.clubName}>{item.club?.name}</Text>
                    <Text style={s.cityText}>📍 {item.club?.city}</Text>
                  </View>
                  <TouchableOpacity
                    style={s.bookBtn}
                    onPress={() => router.push({ pathname: "/court/[id]", params: { id: item.id, date: selectedDate } } as any)}
                  >
                    <Text style={s.bookBtnText}>Book</Text>
                  </TouchableOpacity>
                </View>

                <View style={s.surfaceRow}>
                  <View style={[s.surfacePill, { backgroundColor: accent + "44" }]}>
                    <Text style={[s.surfacePillText, { color: Colors.brandLight }]}>
                      {item.surface?.replace(/_/g, " ")}
                    </Text>
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

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 13, color: Colors.textMuted, fontWeight: "600", marginBottom: 2 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: Colors.text },
  logoMark: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },

  // Search
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text, padding: 0 },
  clearBtn: { fontSize: 14, color: Colors.textMuted },

  // Date strip
  dateStrip: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  dateChip: { alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, minWidth: 62 },
  dateChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dateChipLabel: { fontSize: 11, fontWeight: "700", color: Colors.textMuted, marginBottom: 2, textTransform: "uppercase" },
  dateChipLabelActive: { color: "#fff" },
  dateChipDay: { fontSize: 16, fontWeight: "900", color: Colors.text },
  dateChipDayActive: { color: "#fff" },

  // Filter chips
  filterStrip: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: "#052e16", borderColor: "#166534" },
  filterChipText: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },
  filterChipTextActive: { color: Colors.brand },
  cityChipActive: { backgroundColor: Colors.surfaceHigh, borderColor: Colors.brand },
  cityChipTextActive: { color: Colors.text },

  // Results
  resultsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  resultsLabel: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },

  // Card
  card: { marginHorizontal: 16, marginBottom: 14, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardBanner: { height: 130, alignItems: "center", justifyContent: "center", position: "relative" },
  cardEmoji: { fontSize: 50 },
  bannerTopRow: { position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between" },
  typePill: { backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  typePillText: { color: "#e5e7eb", fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  pricePill: { backgroundColor: Colors.brand, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "baseline", gap: 1 },
  pricePillValue: { color: "#fff", fontSize: 15, fontWeight: "900" },
  pricePillUnit: { color: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: "600" },
  cardBody: { padding: 14 },
  cardBodyTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  courtName: { fontSize: 16, fontWeight: "800", color: Colors.text, marginBottom: 2 },
  clubName: { fontSize: 13, color: Colors.brand, fontWeight: "600", marginBottom: 3 },
  cityText: { fontSize: 12, color: Colors.textMuted },
  bookBtn: { backgroundColor: Colors.brand, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 },
  bookBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  surfaceRow: { flexDirection: "row" },
  surfacePill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  surfacePillText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },

  // Empty
  emptyBox: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: Colors.text, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", marginBottom: 20 },
  clearFiltersBtn: { backgroundColor: Colors.surface, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.border },
  clearFiltersBtnText: { fontSize: 14, color: Colors.brand, fontWeight: "700" },
});
