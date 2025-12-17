import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";
import type { Debt } from "@/lib/debtRepo";
import { listDebts, totals } from "@/lib/debtRepo";
import { runReminderSweep } from "@/lib/reminder";

const filters = [
  { id: "all", label: "Semua" },
  { id: "urgent", label: "Segera" },
  { id: "overdue", label: "Terlambat" },
  { id: "scheduled", label: "Terjadwal" },
  { id: "paid", label: "Lunas" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function DebtsScreen() {
  const [items, setItems] = useState<Debt[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  const refresh = useCallback(() => {
    const data = listDebts();
    setItems(data);
    setTotalOutstanding(totals().outstanding);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      void runReminderSweep();
    }, [refresh]),
  );

  const filteredItems = useMemo(() => {
    return items.filter((debt) => {
      const status = deriveFilterStatus(debt);
      if (selectedFilter === "all") {
        return true;
      }
      if (selectedFilter === "paid") {
        return debt.status === "PAID";
      }
      return status === selectedFilter;
    });
  }, [items, selectedFilter]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500">Tagihan aktif</Text>
            <Text className="text-2xl font-semibold text-slate-900">
              Rp{totalOutstanding.toLocaleString("id-ID")}
            </Text>
          </View>
          <Button label="+ Hutang baru" onPress={() => router.push("/debt/new")} />
        </View>

        <View className="mt-6 flex-row flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                className={`rounded-full border px-4 py-2 ${
                  isActive ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-600"}`}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/debt/[id]", params: { id: String(item.id) } })
              }
            >
              <DebtCard
                debtor={item.debtorName}
                amount={item.amount}
                dueDate={new Date(item.dueDate)}
                note={item.note ?? undefined}
                status={deriveCardStatus(item)}
              />
            </Pressable>
          )}
          contentContainerStyle={{ paddingVertical: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-6">
              <Text className="text-center text-sm text-slate-500">
                Belum ada data untuk filter ini.
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-slate-900">Daftar hutang</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="filter-outline" size={16} color="#475569" />
                <Text className="text-sm text-slate-500">Filter</Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function deriveFilterStatus(debt: Debt): Exclude<FilterId, "paid" | "all"> {
  if (debt.status === "PAID") {
    return "scheduled";
  }

  const due = new Date(debt.dueDate);
  const now = new Date();
  if (due < now) {
    return "overdue";
  }

  const soon = new Date();
  soon.setDate(now.getDate() + 3);
  if (due <= soon) {
    return "urgent";
  }

  return "scheduled";
}

function deriveCardStatus(debt: Debt) {
  const status = deriveFilterStatus(debt);
  if (debt.status === "PAID") {
    return "scheduled" as const;
  }
  return status === "urgent" ? "urgent" : status === "overdue" ? "overdue" : "scheduled";
}
