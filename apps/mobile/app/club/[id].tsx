import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";
import { MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Zap } from "lucide-react-native";

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [club, setClub] = useState<any>(null);
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("clubs").select("*").eq("id", id).single(),
      supabase.from("courts").select("*").eq("club_id", id).eq("is_active", true).order("name"),
    ]).then(([{ data: clubData }, { data: courtsData }]) => {
      setClub(clubData);
      setCourts(courtsData ?? []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <View style={s.center}><ActivityIndicator color={Colors.brand} size="large" /></View>;
  if (!club) return null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={s.banner}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={s.bannerEmoji}>🏟️</Text>
        <View style={s.bannerOverlay}>
          <Text style={s.bannerName}>{club.name}</Text>
          <View style={s.bannerLocation}>
            <MapPin size={12} color={Colors.brandLight} strokeWidth={2} />
            <Text style={s.bannerCity}>{club.city}, {club.country}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {club.description && (
        <View style={s.section}>
          <Text style={s.desc}>{club.description}</Text>
        </View>
      )}

      {/* Contact info */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Contact</Text>

        {club.address && (
          <View style={s.contactRow}>
            <View style={s.contactIcon}>
              <MapPin size={15} color={Colors.brand} strokeWidth={2} />
            </View>
            <Text style={s.contactText}>{club.address}, {club.city}</Text>
          </View>
        )}
        {club.phone && (
          <TouchableOpacity style={s.contactRow} onPress={() => Linking.openURL(`tel:${club.phone}`)}>
            <View style={s.contactIcon}>
              <Phone size={15} color={Colors.brand} strokeWidth={2} />
            </View>
            <Text style={[s.contactText, s.contactLink]}>{club.phone}</Text>
          </TouchableOpacity>
        )}
        {club.email && (
          <TouchableOpacity style={s.contactRow} onPress={() => Linking.openURL(`mailto:${club.email}`)}>
            <View style={s.contactIcon}>
              <Mail size={15} color={Colors.brand} strokeWidth={2} />
            </View>
            <Text style={[s.contactText, s.contactLink]}>{club.email}</Text>
          </TouchableOpacity>
        )}
        {club.website && (
          <TouchableOpacity style={s.contactRow} onPress={() => Linking.openURL(club.website)}>
            <View style={s.contactIcon}>
              <Globe size={15} color={Colors.brand} strokeWidth={2} />
            </View>
            <Text style={[s.contactText, s.contactLink]}>{club.website}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Courts */}
      <View style={[s.section, { marginBottom: 40 }]}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Courts</Text>
          <View style={s.countBadge}>
            <Text style={s.countText}>{courts.length}</Text>
          </View>
        </View>

        {courts.length === 0 ? (
          <Text style={s.empty}>No courts listed yet.</Text>
        ) : (
          courts.map((court, i) => (
            <TouchableOpacity
              key={court.id}
              style={[s.courtCard, i < courts.length - 1 && s.courtCardBorder]}
              onPress={() => router.push(`/court/${court.id}` as any)}
              activeOpacity={0.75}
            >
              <View style={s.courtIcon}>
                <Text style={{ fontSize: 18 }}>🎾</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.courtName}>{court.name}</Text>
                <View style={s.courtPills}>
                  <View style={s.pill}><Text style={s.pillText}>{court.surface?.replace("_", " ")}</Text></View>
                  <View style={s.pill}><Text style={s.pillText}>{court.type}</Text></View>
                </View>
              </View>
              <View style={s.courtRight}>
                <View style={s.courtPrice}>
                  <Zap size={11} color={Colors.brand} strokeWidth={2.5} />
                  <Text style={s.courtPriceText}>£{court.price_per_hour}</Text>
                </View>
                <ChevronRight size={16} color={Colors.textDim} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },
  banner: { height: 240, backgroundColor: "#052e16", alignItems: "center", justifyContent: "center", position: "relative" },
  backBtn: { position: "absolute", top: 52, left: 16, width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  bannerEmoji: { fontSize: 64 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 20, paddingVertical: 14 },
  bannerName: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  bannerLocation: { flexDirection: "row", alignItems: "center", gap: 5 },
  bannerCity: { fontSize: 13, color: Colors.brandLight, fontWeight: "600" },
  section: { margin: 16, marginBottom: 0, backgroundColor: Colors.surface, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  desc: { fontSize: 14, color: Colors.textMuted, lineHeight: 22 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  countBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.brand, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  countText: { fontSize: 12, fontWeight: "800", color: "#fff" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  contactIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },
  contactText: { fontSize: 14, color: Colors.text, flex: 1 },
  contactLink: { color: Colors.brand },
  empty: { fontSize: 14, color: Colors.textMuted, textAlign: "center", paddingVertical: 20 },
  courtCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  courtCardBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  courtIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#052e16", borderWidth: 1, borderColor: "#166534", justifyContent: "center", alignItems: "center" },
  courtName: { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  courtPills: { flexDirection: "row", gap: 6 },
  pill: { backgroundColor: Colors.surfaceHigh, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.border },
  pillText: { color: Colors.textMuted, fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  courtRight: { alignItems: "flex-end", gap: 6 },
  courtPrice: { flexDirection: "row", alignItems: "center", gap: 3 },
  courtPriceText: { fontSize: 16, fontWeight: "900", color: Colors.brand },
});
