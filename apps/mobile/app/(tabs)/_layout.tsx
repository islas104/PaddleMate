import { Tabs } from "expo-router";
import { Zap, Users, MapPin, CalendarDays, UserCircle2 } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textDim,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Courts", tabBarIcon: ({ color }) => <Zap size={22} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="matches"
        options={{ title: "Matches", tabBarIcon: ({ color }) => <Users size={22} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="clubs"
        options={{ title: "Clubs", tabBarIcon: ({ color }) => <MapPin size={22} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings", tabBarIcon: ({ color }) => <CalendarDays size={22} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <UserCircle2 size={22} color={color} strokeWidth={2.2} /> }}
      />
    </Tabs>
  );
}
