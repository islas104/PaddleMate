import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { Trophy, MapPin, LogOut, ChevronRight, CalendarDays, Settings } from "lucide-react-native";

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

  const menuItems = [
    { icon: <CalendarDays size={16} color={Colors.textMuted} strokeWidth={2} />, label: "My Bookings", route: "/(tabs)/bookings" as any },
    { icon: <Settings size={16} color={Colors.textMuted} strokeWidth={2} />, label: "Settings", route: null },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Green hero background */}
      <View style={s.heroBg} />

      {/* Avatar + name */}
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
          <Text style={s.statValue}>{bookingCount}</Text>
          <Text style={s.statLabel}>Bookings</Text>
        </View>
        <View style={[s.statCard, s.statCardCenter]}>
          <Text style={s.statValueEmoji}>🎾</Text>
          <Text style={s.statLabel}>Padel</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statValue} numberOfLines={1}>
            {profile.skill_level
              ? profile.skill_level.charAt(0).toUpperCase() + profile.skill_level.slice(1)
              : "—"}
          </Text>
          <Text style={s.statLabel}>Level</Text>
        </View>
      </View>

      {/* About section */}
      {(profile.bio || profile.location) && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>About</Text>
          {profile.bio && <Text style={s.bio}>{profile.bio}</Text>}
          {profile.location && (
            <View style={s.infoRow}>
              <MapPin size={14} color={Colors.textMuted} strokeWidth={2} />
              <Text style={s.infoValue}>{profile.location}</Text>
            </View>
          )}
        </View>
      )}

      {/* Account menu */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[s.menuRow, i < menuItems.length - 1 && s.menuRowBorder]}
            onPress={() => item.route && router.push(item.route)}
            activeOpacity={item.route ? 0.7 : 1}
          >
            <View style={s.menuIconWrap}>{item.icon}</View>
            <Text style={s.menuLabel}>{item.label}</Text>
            <ChevronRight size={15} color={Colors.textDim} strokeWidth={2} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={s.signOut}
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login" as any);
        }}
        activeOpacity={0.75}
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

  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#052e16",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    borderColor: "#166534",
  },

  hero: { alignItems: "center", paddingTop: 62, paddingBottom: 24, paddingHorizontal: 24 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.brandDark,
    borderWidth: 3,
    borderColor: Colors.brand,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: Colors.brandDark, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 38, fontWeight: "900", color: "#fff" },
  name: { fontSize: 24, fontWeight: "900", color: Colors.text, marginBottom: 3, letterSpacing: -0.3 },
  email: { fontSize: 13, color: Colors.textMuted, marginBottom: 12 },
  levelBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0a2e16", borderWidth: 1, borderColor: "#166534", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  levelText: { color: Colors.brand, fontSize: 13, fontWeight: "700", textTransform: "capitalize" },

  statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, paddingVertical: 16, alignItems: "center", gap: 4 },
  statCardCenter: { borderColor: Colors.border },
  statValue: { fontSize: 18, fontWeight: "900", color: Colors.text, textTransform: "capitalize" },
  statValueEmoji: { fontSize: 20 },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },

  section: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "800", color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  bio: { fontSize: 14, color: Colors.textMuted, lineHeight: 21, marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: "500" },

  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIconWrap: { width: 30, height: 30, borderRadius: 9, backgroundColor: Colors.surfaceHigh, justifyContent: "center", alignItems: "center" },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: "600" },

  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#450a0a",
    borderRadius: 16,
    paddingVertical: 15,
    backgroundColor: "rgba(69,10,10,0.25)",
  },
  signOutText: { color: "#f87171", fontSize: 15, fontWeight: "700" },
});
