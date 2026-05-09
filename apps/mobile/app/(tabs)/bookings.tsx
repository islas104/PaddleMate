import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { CalendarDays, Clock, MapPin, X } from "lucide-react-native";

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

const STATUS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending:   { bg: "#422006", text: "#fbbf24", border: "#92400e", label: "Pending" },
  confirmed: { bg: "#052e16", text: "#4ade80", border: "#166534", label: "Confirmed" },
  cancelled: { bg: "#450a0a", text: "#f87171", border: "#991b1b", label: "Cancelled" },
  completed: { bg: "#111827", text: "#6b7280", border: "#374151", label: "Completed" },
};

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  async function fetchBookings(uid: string) {
    const { data } = await supabase
      .from("bookings")
      .select("*, court:courts(name, club:clubs(name, city))")
      .eq("user_id", uid)
      .order("starts_at", { ascending: false });
    setBookings(data ?? []);
  }

  useFocusEffect(useCallback(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace("/(auth)/login" as any); return; }
      setUserId(data.user.id);
      await fetchBookings(data.user.id);
      setLoading(false);
    });
  }, []));

  async function onRefresh() {
    if (!userId) return;
    setRefreshing(true);
    await fetchBookings(userId);
    setRefreshing(false);
  }

  async function cancelBooking(id: string) {
    Alert.alert("Cancel booking", "Are you sure you want to cancel this booking?", [
      { text: "Keep it", style: "cancel" },
      {
        text: "Cancel booking", style: "destructive",
        onPress: async () => {
          await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
          if (userId) fetchBookings(userId);
        },
      },
    ]);
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;

  const upcoming = bookings.filter((b) => new Date(b.starts_at) > new Date() && b.status !== "cancelled");
  const past = bookings.filter((b) => new Date(b.starts_at) <= new Date() || b.status === "cancelled");

  return (
    <View style={s.container}>
      <FlatList
        data={[...upcoming, ...past]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
        ListHeaderComponent={
          <View style={s.header}>
            <View style={s.headerRow}>
              <CalendarDays size={22} color={Colors.brand} strokeWidth={2.2} />
              <Text style={s.headerTitle}>My Bookings</Text>
            </View>
            {upcoming.length > 0 ? (
              <View style={s.upcomingBadge}>
                <View style={s.upcomingDot} />
                <Text style={s.upcomingBadgeText}>
                  {upcoming.length} upcoming booking{upcoming.length !== 1 ? "s" : ""}
                </Text>
              </View>
            ) : (
              <Text style={s.headerSub}>No upcoming bookings</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>📅</Text>
            <Text style={s.emptyTitle}>No bookings yet</Text>
            <Text style={s.emptySub}>Book a court to get started</Text>
            <TouchableOpacity style={s.findBtn} onPress={() => router.push("/(tabs)" as any)}>
              <Text style={s.findBtnText}>Find a court →</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => {
          const isUpcoming = new Date(item.starts_at) > new Date() && item.status !== "cancelled";
          const isPast = !isUpcoming;
          const isFirstPast = isPast && index === upcoming.length;
          const sc = STATUS[item.status] ?? STATUS.completed;

          return (
            <>
              {index === 0 && upcoming.length > 0 && (
                <Text style={s.sectionLabel}>Upcoming</Text>
              )}
              {isFirstPast && past.length > 0 && (
                <Text style={[s.sectionLabel, { color: Colors.textMuted, marginTop: index > 0 ? 8 : 0 }]}>Past</Text>
              )}
              <View style={[s.card, isPast && s.cardDim]}>
                <View style={s.cardTop}>
                  <View style={s.courtIcon}>
                    <Text style={{ fontSize: 20 }}>🎾</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.courtName}>{item.court?.name}</Text>
                    <View style={s.clubRow}>
                      <MapPin size={11} color={Colors.textMuted} strokeWidth={2} />
                      <Text style={s.clubName}>{item.court?.club?.name} · {item.court?.club?.city}</Text>
                    </View>
                    <View style={s.timeRow}>
                      <Clock size={11} color={Colors.brand} strokeWidth={2} />
                      <Text style={s.timeText}>{formatSlot(item.starts_at)}</Text>
                    </View>
                  </View>
                  <View style={s.rightCol}>
                    <View style={[s.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                      <Text style={[s.statusText, { color: sc.text }]}>{sc.label}</Text>
                    </View>
                    <Text style={s.price}>£{item.total_price}</Text>
                  </View>
                </View>
                {isUpcoming && item.status !== "cancelled" && (
                  <TouchableOpacity style={s.cancelBtn} onPress={() => cancelBooking(item.id)}>
                    <X size={13} color={Colors.textMuted} strokeWidth={2.5} />
                    <Text style={s.cancelText}>Cancel booking</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
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
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: "900", color: Colors.text },
  headerSub: { fontSize: 14, color: Colors.textMuted },
  upcomingBadge: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: "#052e16", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#166534" },
  upcomingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.brand },
  upcomingBadgeText: { fontSize: 13, fontWeight: "700", color: Colors.brand },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: Colors.brand, textTransform: "uppercase", letterSpacing: 1, marginHorizontal: 16, marginBottom: 8, marginTop: 4 },
  card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  cardDim: { opacity: 0.5 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  courtIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },
  courtName: { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 5 },
  clubRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  clubName: { fontSize: 12, color: Colors.textMuted },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeText: { fontSize: 12, color: Colors.brand, fontWeight: "600" },
  rightCol: { alignItems: "flex-end", gap: 8 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: "700" },
  price: { fontSize: 16, fontWeight: "900", color: Colors.text },
  cancelBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingVertical: 10 },
  cancelText: { fontSize: 13, color: Colors.textMuted, fontWeight: "600" },
  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, marginBottom: 24 },
  findBtn: { backgroundColor: Colors.brand, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 16 },
  findBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
