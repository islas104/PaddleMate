import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="court/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="club/[id]" options={{ presentation: "card" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
