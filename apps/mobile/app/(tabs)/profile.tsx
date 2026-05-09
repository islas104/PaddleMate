import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@paddlemate/shared";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/(auth)/login");
        return;
      }
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setProfile(p);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile.full_name[0]}</Text>
      </View>
      <Text style={styles.name}>{profile.full_name}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{profile.skill_level}</Text>
      </View>

      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      <TouchableOpacity
        style={styles.signOut}
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/(auth)/login");
        }}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  email: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  badge: {
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 12,
  },
  badgeText: { color: "#16a34a", fontSize: 13, fontWeight: "600", textTransform: "capitalize" },
  bio: { fontSize: 14, color: "#6b7280", marginTop: 16, textAlign: "center" },
  signOut: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signOutText: { color: "#374151", fontSize: 15, fontWeight: "500" },
});
