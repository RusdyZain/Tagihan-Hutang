import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

const tabConfig = {
  index: {
    label: "Ringkasan",
    icon: "pie-chart-outline" as const,
  },
  debts: {
    label: "Hutang",
    icon: "wallet-outline" as const,
  },
  deadlines: {
    label: "Deadline",
    icon: "alarm-outline" as const,
  },
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 74,
        },
        tabBarIcon: ({ focused }) => {
          const config = tabConfig[route.name as keyof typeof tabConfig];
          return (
            <TabIcon
              label={config?.label ?? route.name}
              iconName={config?.icon ?? "ellipse-outline"}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="debts" />
      <Tabs.Screen name="deadlines" />
    </Tabs>
  );
}

type TabIconProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

function TabIcon({ label, iconName, focused }: TabIconProps) {
  return (
    <View
      className={`flex-row items-center rounded-full px-4 py-2 ${
        focused ? "bg-slate-900" : "bg-transparent"
      }`}
    >
      <Ionicons
        name={iconName}
        size={18}
        color={focused ? "#fff" : "#475569"}
        style={{ marginRight: 8 }}
      />
      <Text className={`text-sm font-semibold ${focused ? "text-white" : "text-slate-500"}`}>
        {label}
      </Text>
    </View>
  );
}
