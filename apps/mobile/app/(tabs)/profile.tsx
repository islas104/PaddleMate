import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Trophy, MapPin, Phone, LogOut, ChevronRight, CalendarDays } from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace("/(auth)/login" as any); return; }
      const [{ data: p }, { count }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", data.user.id).single(),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", data.user.id).neq("status", "cancelled"),
      ]);
      setProfile(p);
      setBookingCount(count ?? 0);
      setLoading(false);
    });
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;
  if (!profile) return null;

  const initial = profile.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        <View style={s.avatarRing}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initial}</Text>
          </View>
        </View>
        <Text style={s.name}>{profile.full_name}</Text>
        <Text style={s.email}>{profile.email}</Text>
        <View style={s.levelBadge}>
          <Trophy size={12} color={Colors.brand} strokeWidth={2.5} />
          <Text style={s.levelText}>{profile.skill_level ?? "Player"}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <CalendarDays size={18} color={Colors.brand} strokeWidth={2} />
          <Text style={s.statValue}>{bookingCount}</Text>
          <Text style={s.statLabel}>Bookings</Text>
        </View>
        <View style={[s.statCard, s.statCardMid]}>
          <Text style={s.statEmoji}>🎾</Text>
          <Text style={s.statValue}>Padel</Text>
          <Text style={s.statLabel}>Sport</Text>
        </View>
        <View style={s.statCard}>
          <Trophy size={18} color={Colors.brand} strokeWidth={2} />
          <Text style={s.statValue}>{profile.skill_level ? profile.skill_level.charAt(0).toUpperCase() + profile.skill_level.slice(1) : "—"}</Text>
          <Text style={s.statLabel}>Level</Text>
        </View>
      </View>

      {/* Info */}
      {(profile.bio || profile.location || profile.phone) && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>About</Text>
          {profile.bio && <Text style={s.bio}>{profile.bio}</Text>}
          {profile.location && (
            <View style={s.infoRow}>
              <View style={s.infoIconWrap}>
                <MapPin size={14} color={Colors.textMuted} strokeWidth={2} />
              </View>
              <Text style={s.infoValue}>{profile.location}</Text>
            </View>
          )}
          {profile.phone && (
            <View style={s.infoRow}>
              <View style={s.infoIconWrap}>
                <Phone size={14} color={Colors.textMuted} strokeWidth={2} />
              </View>
              <Text style={s.infoValue}>{profile.phone}</Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        <TouchableOpacity style={s.menuRow} onPress={() => router.push("/(tabs)/bookings" as any)}>
          <CalendarDays size={16} color={Colors.textMuted} strokeWidth={2} />
          <Text style={s.menuLabel}>My Bookings</Text>
          <ChevronRight size={16} color={Colors.textDim} />
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={s.signOut}
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login" as any);
        }}
      >
        <LogOut size={16} color="#f87171" strokeWidth={2} />
        <Text style={s.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 48 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },
  hero: { alignItems: "center", paddingTop: 70, paddingBottom: 28, paddingHorizontal: 24 },
  avatarRing: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#052e16", borderWidth: 2, borderColor: Colors.brand, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.brandDark, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 36, fontWeight: "900", color: "#fff" },
  name: { fontSize: 24, fontWeight: "900", color: Colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.textMuted, marginBottom: 12 },
  levelBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  levelText: { color: Colors.brand, fontSize: 13, fontWeight: "700", textTransform: "capitalize" },
  statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16, alignItems: "center", gap: 6 },
  statCardMid: { borderColor: Colors.border },
  statEmoji: { fontSize: 18 },
  statValue: { fontSize: 16, fontWeight: "900", color: Colors.text, textTransform: "capitalize" },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  section: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  bio: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.surfaceHigh, justifyContent: "center", alignItems: "center" },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: "500" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: "600" },
  signOut: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 4, borderWidth: 1, borderColor: "#450a0a", borderRadius: 16, paddingVertical: 15, backgroundColor: "rgba(69,10,10,0.3)" },
  signOutText: { color: "#f87171", fontSize: 15, fontWeight: "700" },
});
