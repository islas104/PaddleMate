import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, ChevronLeft, Zap, Clock } from "lucide-react-native";

const TIME_SLOTS = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

function todayStr() { return new Date().toISOString().split("T")[0]; }

function buildDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric" }).format(d),
      value: d.toISOString().split("T")[0],
    };
  });
}

const DATES = buildDates();

export default function CourtDetailScreen() {
  const { id, date: paramDate } = useLocalSearchParams<{ id: string; date?: string }>();
  const router = useRouter();
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(paramDate ?? todayStr());
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
    setSlot(null);
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
      Alert.alert("Slot unavailable", "This slot was just taken. Pick another.");
      setSlot(null);
      return;
    }
    Alert.alert("Booking confirmed! 🎾", `${court.name} — ${slot} · ${new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(new Date(date))}`, [
      { text: "View bookings", onPress: () => router.push("/(tabs)/bookings" as any) },
      { text: "Done" },
    ]);
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;
  if (!court) return null;

  const isToday = date === todayStr();
  const now = new Date().toTimeString().slice(0, 5);
  const endHour = slot ? String(Number(slot.split(":")[0]) + 1).padStart(2, "0") + ":00" : null;
  const availableCount = TIME_SLOTS.filter((t) => {
    const past = isToday && t <= now;
    return !takenSlots.has(t) && !past;
  }).length;

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
          <View style={s.bannerMeta}>
            <MapPin size={12} color={Colors.brandLight} strokeWidth={2} />
            <Text style={s.bannerClub}>{court.club?.name} · {court.club?.city}</Text>
          </View>
        </View>
      </View>

      {/* Quick info strip */}
      <View style={s.infoStrip}>
        <View style={s.infoItem}>
          <Text style={s.infoValue}>{court.surface?.replace(/_/g, " ")}</Text>
          <Text style={s.infoLabel}>Surface</Text>
        </View>
        <View style={s.infoSep} />
        <View style={s.infoItem}>
          <Text style={s.infoValue}>{court.type}</Text>
          <Text style={s.infoLabel}>Type</Text>
        </View>
        <View style={s.infoSep} />
        <View style={s.infoItem}>
          <Text style={[s.infoValue, { color: Colors.brand }]}>£{court.price_per_hour}</Text>
          <Text style={s.infoLabel}>Per hour</Text>
        </View>
        <View style={s.infoSep} />
        <View style={s.infoItem}>
          <Text style={[s.infoValue, availableCount === 0 && { color: "#f87171" }]}>{availableCount}</Text>
          <Text style={s.infoLabel}>Slots left</Text>
        </View>
      </View>

      {/* Date picker */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Select date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateStrip}>
          {DATES.map((d) => {
            const active = date === d.value;
            return (
              <TouchableOpacity
                key={d.value}
                style={[s.dateChip, active && s.dateChipActive]}
                onPress={() => setDate(d.value)}
              >
                <Text style={[s.dateChipText, active && s.dateChipTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Slot picker */}
      <View style={s.section}>
        <View style={s.slotHeader}>
          <Text style={s.sectionTitle}>Available slots</Text>
          <View style={s.slotLegend}>
            <View style={s.legendDot} />
            <Text style={s.legendText}>Available</Text>
            <View style={[s.legendDot, { backgroundColor: "#374151" }]} />
            <Text style={s.legendText}>Past / Taken</Text>
          </View>
        </View>

        <View style={s.slots}>
          {TIME_SLOTS.map((t) => {
            const taken = takenSlots.has(t);
            const past = isToday && t <= now;
            const selected = slot === t;
            const disabled = taken || past;
            return (
              <TouchableOpacity
                key={t}
                style={[s.slot, selected && s.slotSelected, disabled && s.slotDisabled]}
                onPress={() => !disabled && setSlot(t)}
                disabled={disabled}
              >
                <Text style={[s.slotText, selected && s.slotTextSelected, disabled && s.slotTextDisabled]}>{t}</Text>
                {taken && <View style={s.takenBar} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Booking summary */}
      {slot && endHour && (
        <View style={s.section}>
          <View style={s.summaryHeader}>
            <Clock size={14} color={Colors.brand} strokeWidth={2} />
            <Text style={s.sectionTitle}>Booking summary</Text>
          </View>
          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Date</Text>
              <Text style={s.summaryValue}>{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date(date))}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Time</Text>
              <Text style={s.summaryValue}>{slot} – {endHour}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Court</Text>
              <Text style={s.summaryValue}>{court.name}</Text>
            </View>
            <View style={[s.summaryRow, s.summaryTotalRow]}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>£{court.price_per_hour}</Text>
            </View>
          </View>
        </View>
      )}

      {/* CTA */}
      <View style={s.ctaWrap}>
        <TouchableOpacity
          style={[s.bookBtn, (!slot || booking) && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!slot || booking}
        >
          <Zap size={18} color="#fff" strokeWidth={2.5} />
          <Text style={s.bookBtnText}>
            {booking ? "Booking…" : slot ? `Confirm booking · £${court.price_per_hour}` : "Select a time slot"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },

  banner: { height: 230, backgroundColor: "#052e16", alignItems: "center", justifyContent: "center", position: "relative" },
  backBtn: { position: "absolute", top: 52, left: 16, width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", zIndex: 1 },
  bannerEmoji: { fontSize: 68 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 20, paddingVertical: 14 },
  bannerName: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  bannerMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  bannerClub: { fontSize: 13, color: Colors.brandLight, fontWeight: "600" },

  infoStrip: { flexDirection: "row", backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  infoValue: { fontSize: 14, fontWeight: "800", color: Colors.text, textTransform: "capitalize", marginBottom: 2 },
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.3 },
  infoSep: { width: 1, backgroundColor: Colors.border, marginVertical: 10 },

  section: { marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: Colors.text, marginBottom: 12 },

  dateStrip: { gap: 8 },
  dateChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.surfaceHigh, borderWidth: 1, borderColor: Colors.border },
  dateChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dateChipText: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },
  dateChipTextActive: { color: "#fff" },

  slotHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  slotLegend: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.brand },
  legendText: { fontSize: 10, color: Colors.textMuted, fontWeight: "600", marginRight: 6 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "22%", paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.surfaceHigh, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", overflow: "hidden" },
  slotSelected: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  slotDisabled: { backgroundColor: "rgba(31,41,55,0.3)", borderColor: "transparent" },
  slotText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  slotTextSelected: { color: "#fff" },
  slotTextDisabled: { color: Colors.textDim, textDecorationLine: "line-through" },
  takenBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, backgroundColor: "#ef4444" },

  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  summaryCard: { backgroundColor: Colors.surfaceHigh, borderRadius: 14, padding: 14, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: Colors.textMuted },
  summaryValue: { fontSize: 13, color: Colors.text, fontWeight: "600" },
  summaryTotalRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  totalLabel: { fontSize: 15, fontWeight: "800", color: Colors.text },
  totalValue: { fontSize: 20, fontWeight: "900", color: Colors.brand },

  ctaWrap: { marginHorizontal: 16, marginTop: 16 },
  bookBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.brand, borderRadius: 18, paddingVertical: 18 },
  bookBtnDisabled: { opacity: 0.35 },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
