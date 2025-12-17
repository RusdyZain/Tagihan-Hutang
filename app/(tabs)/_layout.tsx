import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";

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
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="debts" />
      <Tabs.Screen name="deadlines" />
    </Tabs>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="px-5 pb-6 pt-2">
      <View className="flex-row items-center justify-between gap-2 rounded-3xl border border-slate-100 bg-white/95 p-3 shadow-lg shadow-slate-900/10">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = tabConfig[route.name as keyof typeof tabConfig];
          const label = config?.label ?? route.name;
          const iconName = config?.icon ?? "ellipse-outline";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <TabButton
              key={route.key}
              label={label}
              iconName={iconName}
              focused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabButtonProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabButton({
  label,
  iconName,
  focused,
  onPress,
  onLongPress,
}: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1"
    >
      <View
        className={`flex-row items-center justify-center gap-2 rounded-2xl px-3 py-2  ${
          focused ? "bg-slate-900" : "bg-transparent"
        }`}
      >
        <View
          className={`rounded-full p-2 ${
            focused ? "bg-white/20" : "bg-slate-100"
          }`}
        >
          <Ionicons
            name={iconName}
            size={18}
            color={focused ? "#fff" : "#0f172a"}
          />
        </View>
        <Text
          className={`text-sm font-semibold ${
            focused ? "text-white" : "text-slate-600"
          }`}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
