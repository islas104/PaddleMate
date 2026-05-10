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
        tabBarActiveBackgroundColor: "#0a2e16",
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 4,
          marginVertical: 4,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Courts", tabBarIcon: ({ color }) => <Zap size={21} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="matches"
        options={{ title: "Matches", tabBarIcon: ({ color }) => <Users size={21} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="clubs"
        options={{ title: "Clubs", tabBarIcon: ({ color }) => <MapPin size={21} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings", tabBarIcon: ({ color }) => <CalendarDays size={21} color={color} strokeWidth={2.2} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <UserCircle2 size={21} color={color} strokeWidth={2.2} /> }}
      />
    </Tabs>
  );
}
