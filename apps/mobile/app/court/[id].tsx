import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, ChevronLeft, Zap, Clock, Shield } from "lucide-react-native";

const TIME_SLOTS = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

const SURFACE_ACCENT: Record<string, string> = {
  grass: "#166534",
  clay: "#9a3412",
  hard: "#1e40af",
  artificial_grass: "#15803d",
  crystal: "#164e63",
};

function todayStr() { return new Date().toISOString().split("T")[0]; }

function buildDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tmrw" : new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric" }).format(d),
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
    Alert.alert(
      "Booking confirmed! 🎾",
      `${court.name} · ${slot}\n${new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "short" }).format(new Date(date))}`,
      [
        { text: "View bookings", onPress: () => router.push("/(tabs)/bookings" as any) },
        { text: "Done" },
      ]
    );
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;
  if (!court) return null;

  const accent = SURFACE_ACCENT[court.surface] ?? "#1f2937";
  const isToday = date === todayStr();
  const now = new Date().toTimeString().slice(0, 5);
  const endHour = slot ? String(Number(slot.split(":")[0]) + 1).padStart(2, "0") + ":00" : null;
  const availableCount = TIME_SLOTS.filter((t) => !takenSlots.has(t) && !(isToday && t <= now)).length;

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Banner */}
        <View style={[s.banner, { backgroundColor: accent }]}>
          <Text style={s.bannerWatermark}>🎾</Text>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={s.bannerOverlay}>
            <Text style={s.bannerName}>{court.name}</Text>
            <View style={s.bannerMeta}>
              <MapPin size={11} color={Colors.brandLight} strokeWidth={2} />
              <Text style={s.bannerClub}>{court.club?.name} · {court.club?.city}</Text>
            </View>
          </View>
          <View style={s.bannerPriceBadge}>
            <Text style={s.bannerPriceVal}>£{court.price_per_hour}</Text>
            <Text style={s.bannerPriceUnit}>/hr</Text>
          </View>
        </View>

        {/* Quick info strip */}
        <View style={s.infoStrip}>
          {[
            { label: "Surface", value: court.surface?.replace(/_/g, " ") },
            { label: "Type", value: court.type },
            { label: "Available", value: String(availableCount), accent: availableCount === 0 },
          ].map((item, i) => (
            <View key={item.label} style={[s.infoItem, i < 2 && s.infoItemBorder]}>
              <Text style={[s.infoValue, item.accent && { color: "#f87171" }]} numberOfLines={1}>
                {item.value}
              </Text>
              <Text style={s.infoLabel}>{item.label}</Text>
            </View>
          ))}
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
              <Text style={s.legendText}>Free</Text>
              <View style={[s.legendDot, { backgroundColor: Colors.textDim }]} />
              <Text style={s.legendText}>Taken</Text>
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

        {/* Booking summary (only when slot selected) */}
        {slot && endHour && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Booking summary</Text>
            <View style={s.summaryCard}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Court</Text>
                <Text style={s.summaryValue}>{court.name}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Date</Text>
                <Text style={s.summaryValue}>
                  {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long" }).format(new Date(date))}
                </Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Time</Text>
                <Text style={s.summaryValue}>{slot} – {endHour}</Text>
              </View>
              <View style={[s.summaryRow, s.summaryTotal]}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.totalValue}>£{court.price_per_hour}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom padding so content clears sticky bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={s.stickyBar}>
        {slot && endHour ? (
          <View style={s.stickyMeta}>
            <Clock size={13} color={Colors.brand} strokeWidth={2} />
            <Text style={s.stickyMetaText}>{slot} – {endHour}</Text>
            <Text style={s.stickyDot}>·</Text>
            <Text style={s.stickyMetaText}>
              {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(date))}
            </Text>
          </View>
        ) : (
          <View style={s.stickyHint}>
            <Shield size={13} color={Colors.textMuted} strokeWidth={2} />
            <Text style={s.stickyHintText}>Instant confirmation · No fees</Text>
          </View>
        )}
        <TouchableOpacity
          style={[s.bookBtn, (!slot || booking) && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!slot || booking}
        >
          <Zap size={17} color="#fff" strokeWidth={2.5} />
          <Text style={s.bookBtnText}>
            {booking ? "Booking…" : slot ? `Confirm booking · £${court.price_per_hour}` : "Select a time slot above"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  content: {},
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },

  banner: { height: 250, position: "relative", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  bannerWatermark: { fontSize: 130, opacity: 0.1, position: "absolute" },
  backBtn: { position: "absolute", top: 52, left: 16, width: 38, height: 38, borderRadius: 13, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", zIndex: 1 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 20, paddingVertical: 14 },
  bannerName: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  bannerMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  bannerClub: { fontSize: 13, color: Colors.brandLight, fontWeight: "600" },
  bannerPriceBadge: { position: "absolute", top: 52, right: 16, backgroundColor: Colors.brand, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "baseline", gap: 2 },
  bannerPriceVal: { fontSize: 18, fontWeight: "900", color: "#fff" },
  bannerPriceUnit: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600" },

  infoStrip: { flexDirection: "row", backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  infoItemBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  infoValue: { fontSize: 14, fontWeight: "800", color: Colors.text, textTransform: "capitalize", marginBottom: 3 },
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },

  section: { marginHorizontal: 16, marginTop: 14, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: Colors.text, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.4 },

  dateStrip: { gap: 8 },
  dateChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.surfaceHigh, borderWidth: 1, borderColor: Colors.border },
  dateChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dateChipText: { fontSize: 12, fontWeight: "700", color: Colors.textMuted },
  dateChipTextActive: { color: "#fff" },

  slotHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  slotLegend: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.brand },
  legendText: { fontSize: 10, color: Colors.textMuted, fontWeight: "600", marginRight: 6 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "22%", paddingVertical: 13, borderRadius: 13, backgroundColor: Colors.surfaceHigh, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", overflow: "hidden" },
  slotSelected: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  slotDisabled: { backgroundColor: "rgba(31,41,55,0.25)", borderColor: "transparent" },
  slotText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  slotTextSelected: { color: "#fff" },
  slotTextDisabled: { color: Colors.textDim, textDecorationLine: "line-through" },
  takenBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, backgroundColor: "#ef4444" },

  summaryCard: { backgroundColor: Colors.surfaceHigh, borderRadius: 14, padding: 14, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: Colors.textMuted },
  summaryValue: { fontSize: 13, color: Colors.text, fontWeight: "600" },
  summaryTotal: { marginTop: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  totalLabel: { fontSize: 15, fontWeight: "800", color: Colors.text },
  totalValue: { fontSize: 22, fontWeight: "900", color: Colors.brand },

  // Sticky bottom bar
  stickyBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    gap: 10,
  },
  stickyMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  stickyMetaText: { fontSize: 13, color: Colors.brand, fontWeight: "700" },
  stickyDot: { fontSize: 13, color: Colors.textMuted },
  stickyHint: { flexDirection: "row", alignItems: "center", gap: 6 },
  stickyHintText: { fontSize: 12, color: Colors.textMuted, fontWeight: "500" },
  bookBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.brand, borderRadius: 16, paddingVertical: 16 },
  bookBtnDisabled: { opacity: 0.35 },
  bookBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
