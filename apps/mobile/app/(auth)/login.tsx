import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={s.logoWrap}>
        <Text style={s.logoEmoji}>🎾</Text>
        <Text style={s.logo}>PaddleMate</Text>
        <Text style={s.subtitle}>Sign in to continue</Text>
      </View>

      <View style={s.form}>
        <TextInput
          style={s.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={Colors.textMuted}
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={Colors.textMuted}
        />

        {error && <Text style={s.error}>{error}</Text>}

        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={s.btnText}>{loading ? "Signing in…" : "Sign in"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup" as any)}>
          <Text style={s.link}>No account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, justifyContent: "center", paddingHorizontal: 24 },
  logoWrap: { alignItems: "center", marginBottom: 40 },
  logoEmoji: { fontSize: 52, marginBottom: 12 },
  logo: { fontSize: 34, fontWeight: "900", color: Colors.text, letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: Colors.textMuted, marginTop: 6 },
  form: { gap: 12 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: Colors.text,
  },
  error: { color: "#f87171", fontSize: 13, textAlign: "center" },
  btn: { backgroundColor: Colors.brand, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  link: { color: Colors.brand, textAlign: "center", fontSize: 14, marginTop: 4 },
});
