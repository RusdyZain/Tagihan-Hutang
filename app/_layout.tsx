import "@/global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initDb } from "@/lib/db";
import { runReminderSweep } from "@/lib/reminder";

initDb();

export default function RootLayout() {
  useEffect(() => {
    void runReminderSweep();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
