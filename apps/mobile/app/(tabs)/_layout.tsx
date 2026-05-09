import { Tabs } from "expo-router";

const GREEN = "#16a34a";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { borderTopColor: "#f3f4f6" },
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Courts", tabBarLabel: "Courts" }}
      />
      <Tabs.Screen
        name="matches"
        options={{ title: "Matches", tabBarLabel: "Matches" }}
      />
      <Tabs.Screen
        name="clubs"
        options={{ title: "Clubs", tabBarLabel: "Clubs" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile" }}
      />
    </Tabs>
  );
}
