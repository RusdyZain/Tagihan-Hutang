import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";

const debts = [
  {
    id: "1",
    debtor: "Deny Prasetyo",
    amount: 2500000,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    note: "Pinjaman untuk project kantor",
    status: "urgent" as const,
  },
  {
    id: "2",
    debtor: "Mega Putri",
    amount: 1100000,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    note: "DP katering",
    status: "overdue" as const,
  },
  {
    id: "3",
    debtor: "Andi Wirawan",
    amount: 4600000,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    note: "Laptop kantor",
    status: "scheduled" as const,
  },
];

const filters = [
  { id: "all", label: "Semua" },
  { id: "urgent", label: "Segera" },
  { id: "overdue", label: "Terlambat" },
  { id: "scheduled", label: "Terjadwal" },
];

export default function DebtsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500">Tagihan aktif</Text>
            <Text className="text-2xl font-semibold text-slate-900">Rp8.700.000</Text>
          </View>
          <Button label="+ Hutang baru" onPress={() => router.push("/debt/new")} />
        </View>

        <View className="mt-6 flex-row gap-2">
          {filters.map((filter, index) => (
            <View
              key={filter.id}
              className={`rounded-full border px-4 py-2 ${
                index === 0 ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  index === 0 ? "text-white" : "text-slate-600"
                }`}
              >
                {filter.label}
              </Text>
            </View>
          ))}
        </View>

        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DebtCard
              debtor={item.debtor}
              amount={item.amount}
              dueDate={item.dueDate}
              note={item.note}
              status={item.status}
            />
          )}
          contentContainerStyle={{ paddingVertical: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-slate-900">Daftar hutang</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="filter-outline" size={16} color="#475569" />
                <Text className="text-sm text-slate-500">Urutkan</Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
