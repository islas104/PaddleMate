import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, Clock, Zap, ChevronLeft } from "lucide-react-native";

const TIME_SLOTS = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

function todayStr() { return new Date().toISOString().split("T")[0]; }

export default function CourtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date] = useState(todayStr());
  const [slot, setSlot] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    supabase
      .from("courts")
      .select("*, club:clubs(name, address, city, phone, email)")
      .eq("id", id)
      .single()
      .then(({ data }) => { setCourt(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("bookings")
      .select("starts_at")
      .eq("court_id", id)
      .gte("starts_at", `${date}T00:00:00`)
      .lte("starts_at", `${date}T23:59:59`)
      .neq("status", "cancelled")
      .then(({ data }) => {
        setTakenSlots(new Set((data ?? []).map((b: any) => new Date(b.starts_at).toTimeString().slice(0, 5))));
      });
  }, [id, date]);

  async function handleBook() {
    if (!slot) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/(auth)/login" as any); return; }

    setBooking(true);
    const startsAt = new Date(`${date}T${slot}:00`);
    const endsAt = new Date(startsAt.getTime() + 3600000);

    const { error } = await supabase.from("bookings").insert({
      court_id: id,
      user_id: user.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      total_price: court.price_per_hour,
      notes: null,
    } as any);

    setBooking(false);
    if (error) {
      Alert.alert("Slot unavailable", "This slot was just taken. Please pick another.");
      setSlot(null);
      return;
    }
    Alert.alert("Booking confirmed! 🎾", `${court.name} — ${slot} on ${date}`, [
      { text: "View bookings", onPress: () => router.push("/(tabs)/bookings" as any) },
      { text: "Done" },
    ]);
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;
  if (!court) return null;

  const now = new Date().toTimeString().slice(0, 5);
  const endHour = slot ? String(Number(slot.split(":")[0]) + 1).padStart(2, "0") + ":00" : null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={s.banner}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={s.bannerEmoji}>🎾</Text>
        <View style={s.bannerOverlay}>
          <Text style={s.bannerName}>{court.name}</Text>
          <Text style={s.bannerClub}>{court.club?.name}</Text>
        </View>
      </View>

      {/* Court info */}
      <View style={s.section}>
        <View style={s.infoRow}>
          <MapPin size={14} color={Colors.textMuted} strokeWidth={2} />
          <Text style={s.infoText}>{court.club?.address}, {court.club?.city}</Text>
        </View>
        <View style={s.pills}>
          <View style={s.pill}><Text style={s.pillText}>{court.surface?.replace("_", " ")}</Text></View>
          <View style={s.pill}><Text style={s.pillText}>{court.type}</Text></View>
          <View style={[s.pill, s.pricePill]}>
            <Zap size={11} color={Colors.brand} strokeWidth={2.5} />
            <Text style={s.priceText}>£{court.price_per_hour}/hr</Text>
          </View>
        </View>
      </View>

      {/* Booking */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Book for today</Text>
        <Text style={s.dateLabel}>
          {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
        </Text>

        <View style={s.legend}>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: Colors.brand }]} /><Text style={s.legendText}>Available</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: "#374151" }]} /><Text style={s.legendText}>Past</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: "#ef4444" }]} /><Text style={s.legendText}>Taken</Text></View>
        </View>

        <View style={s.slots}>
          {TIME_SLOTS.map((t) => {
            const taken = takenSlots.has(t);
            const past = t <= now;
            const selected = slot === t;
            const disabled = taken || past;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  s.slot,
                  selected && s.slotSelected,
                  past && !taken && s.slotPast,
                  taken && s.slotTaken,
                ]}
                onPress={() => !disabled && setSlot(t)}
                disabled={disabled}
              >
                <Text style={[
                  s.slotText,
                  selected && s.slotTextSelected,
                  disabled && s.slotTextDisabled,
                ]}>
                  {t}
                </Text>
                {taken && <View style={s.takenBar} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {slot && endHour && (
          <View style={s.summary}>
            <View style={s.summaryHeader}>
              <Clock size={14} color={Colors.brand} strokeWidth={2} />
              <Text style={s.summaryTitle}>Booking summary</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Time slot</Text>
              <Text style={s.summaryValue}>{slot} – {endHour}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Duration</Text>
              <Text style={s.summaryValue}>1 hour</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Court</Text>
              <Text style={s.summaryValue}>{court.name}</Text>
            </View>
            <View style={[s.summaryRow, s.summaryTotal]}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>£{court.price_per_hour}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[s.bookBtn, (!slot || booking) && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!slot || booking}
        >
          <Zap size={18} color="#fff" strokeWidth={2.5} />
          <Text style={s.bookBtnText}>
            {booking ? "Booking…" : slot ? `Confirm — £${court.price_per_hour}` : "Select a time slot"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Club contact */}
      {(court.club?.phone || court.club?.email) && (
        <View style={[s.section, { marginBottom: 40 }]}>
          <Text style={s.sectionTitle}>Club contact</Text>
          {court.club?.phone && <Text style={s.contactRow}>📞 {court.club.phone}</Text>}
          {court.club?.email && <Text style={s.contactRow}>✉️ {court.club.email}</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },
  banner: { height: 240, backgroundColor: "#052e16", alignItems: "center", justifyContent: "center", position: "relative" },
  backBtn: { position: "absolute", top: 52, left: 16, width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  bannerEmoji: { fontSize: 72 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 20, paddingVertical: 14 },
  bannerName: { fontSize: 22, fontWeight: "900", color: "#fff" },
  bannerClub: { fontSize: 13, color: Colors.brandLight, fontWeight: "600", marginTop: 2 },
  section: { margin: 16, marginBottom: 0, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  infoText: { fontSize: 13, color: Colors.textMuted },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { backgroundColor: Colors.surfaceHigh, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  pillText: { color: Colors.textMuted, fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  pricePill: { backgroundColor: "#052e16", borderColor: "#166534", flexDirection: "row", alignItems: "center", gap: 5 },
  priceText: { color: Colors.brand, fontSize: 13, fontWeight: "800" },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  dateLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 14 },
  legend: { flexDirection: "row", gap: 16, marginBottom: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textMuted, fontWeight: "600" },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "22%", paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.surfaceHigh, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", position: "relative", overflow: "hidden" },
  slotSelected: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  slotPast: { backgroundColor: "rgba(31,41,55,0.3)", borderColor: "transparent" },
  slotTaken: { backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" },
  slotText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  slotTextSelected: { color: "#fff" },
  slotTextDisabled: { color: Colors.textDim, textDecorationLine: "line-through" },
  takenBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, backgroundColor: "#ef4444" },
  summary: { marginTop: 16, backgroundColor: Colors.surfaceHigh, borderRadius: 16, padding: 14, gap: 10 },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  summaryTitle: { fontSize: 13, fontWeight: "700", color: Colors.text },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: Colors.textMuted },
  summaryValue: { fontSize: 13, color: Colors.text, fontWeight: "600" },
  summaryTotal: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  totalLabel: { fontSize: 15, fontWeight: "800", color: Colors.text },
  totalValue: { fontSize: 20, fontWeight: "900", color: Colors.brand },
  bookBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, backgroundColor: Colors.brand, borderRadius: 18, paddingVertical: 17 },
  bookBtnDisabled: { opacity: 0.35 },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  contactRow: { fontSize: 14, color: Colors.textMuted, marginTop: 8 },
});
