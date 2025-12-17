import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Debt, DeadlineBucket } from "@/lib/debtRepo";
import { deadlineBuckets } from "@/lib/debtRepo";
import { runReminderSweep } from "@/lib/reminder";

export default function DeadlinesScreen() {
  const [sections, setSections] = useState<DeadlineBucket[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setSections(deadlineBuckets());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      void runReminderSweep();
    }, [refresh]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-sm text-slate-500">Reminder terjadwal</Text>
            <Text className="mt-1 text-2xl font-semibold text-slate-900">Timeline pengingat</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => <DeadlineCard debt={item} />}
        ListEmptyComponent={
          <View className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-6">
            <Text className="text-center text-sm text-slate-500">
              Semua hutang sudah aman. Tambahkan data baru untuk melihat pengingat di sini.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function DeadlineCard({ debt }: { debt: Debt }) {
  const title =
    new Date(debt.dueDate) < new Date()
      ? "Overdue"
      : new Date(debt.dueDate) <= upcomingThreshold()
        ? "Segera"
        : "Terjadwal";
  const badgeStyle =
    title === "Overdue"
      ? { bg: "bg-rose-50", text: "text-rose-600" }
      : title === "Segera"
        ? { bg: "bg-amber-50", text: "text-amber-600" }
        : { bg: "bg-emerald-50", text: "text-emerald-600" };

  return (
    <View className="mt-3 rounded-3xl border border-slate-100 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">{debt.debtorName}</Text>
        <View className={`rounded-full px-3 py-1 ${badgeStyle.bg}`}>
          <Text className={`text-xs font-semibold ${badgeStyle.text}`}>{title}</Text>
        </View>
      </View>
      <Text className="mt-1 text-sm text-slate-500">
        Jatuh tempo {new Date(debt.dueDate).toLocaleDateString("id-ID")}
      </Text>
      {debt.note ? <Text className="mt-1 text-sm text-slate-400">{debt.note}</Text> : null}
      <View className="mt-3 flex-row items-center gap-2">
        <Ionicons name="call-outline" size={16} color="#475569" />
        <Text className="text-sm text-slate-500">{debt.phone}</Text>
      </View>
    </View>
  );
}

function upcomingThreshold() {
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  return soon;
}
