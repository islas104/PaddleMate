import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, ChevronRight, Phone, Mail } from "lucide-react-native";

export default function ClubsScreen() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;

  return (
    <View style={s.container}>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        ListHeaderComponent={
          <View style={s.header}>
            <View style={s.headerRow}>
              <MapPin size={22} color={Colors.brand} strokeWidth={2.2} />
              <Text style={s.headerTitle}>Clubs</Text>
            </View>
            <Text style={s.headerSub}>Venues partnered with PaddleMate</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🏟️</Text>
            <Text style={s.emptyTitle}>No clubs yet</Text>
            <Text style={s.emptySub}>We're onboarding venues — check back soon</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push(`/club/${item.id}` as any)} activeOpacity={0.8}>
            <View style={s.cardBanner}>
              <Text style={s.emoji}>🏟️</Text>
              <View style={s.bannerOverlay}>
                <Text style={s.bannerName}>{item.name}</Text>
              </View>
            </View>
            <View style={s.cardBody}>
              <View style={s.bodyTop}>
                <View style={{ flex: 1 }}>
                  <View style={s.locationRow}>
                    <MapPin size={12} color={Colors.textMuted} strokeWidth={2} />
                    <Text style={s.locationText}>{item.city}, {item.country}</Text>
                  </View>
                  {item.description && (
                    <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
                  )}
                </View>
                <ChevronRight size={18} color={Colors.textDim} />
              </View>

              <View style={s.bodyFooter}>
                {item.phone && (
                  <View style={s.contactChip}>
                    <Phone size={11} color={Colors.textMuted} strokeWidth={2} />
                    <Text style={s.contactChipText}>Phone</Text>
                  </View>
                )}
                {item.email && (
                  <View style={s.contactChip}>
                    <Mail size={11} color={Colors.textMuted} strokeWidth={2} />
                    <Text style={s.contactChipText}>Email</Text>
                  </View>
                )}
                <View style={s.courtsBadge}>
                  <Text style={s.courtsBadgeText}>View courts →</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
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
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardBanner: { height: 120, backgroundColor: "#052e16", alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 44 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 16, paddingVertical: 8 },
  bannerName: { fontSize: 16, fontWeight: "800", color: "#fff" },
  cardBody: { padding: 14, gap: 12 },
  bodyTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 6 },
  locationText: { fontSize: 13, color: Colors.textMuted, fontWeight: "500" },
  desc: { fontSize: 13, color: Colors.textMuted, lineHeight: 18 },
  bodyFooter: { flexDirection: "row", gap: 8, alignItems: "center" },
  contactChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.surfaceHigh, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  contactChipText: { fontSize: 11, color: Colors.textMuted, fontWeight: "600" },
  courtsBadge: { marginLeft: "auto", backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#166534" },
  courtsBadgeText: { fontSize: 11, fontWeight: "700", color: Colors.brand },
  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: "center", lineHeight: 20 },
});
