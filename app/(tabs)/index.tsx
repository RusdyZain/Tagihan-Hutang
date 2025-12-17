import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";
import { StatCard } from "@/components/StatCard";

const upcomingDebts = [
  {
    id: "1",
    debtor: "Deny Prasetyo",
    amount: 2500000,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    note: "Pinjaman kerjaan kantor",
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
];

const quickActions = [
  {
    id: "reminder",
    label: "Kirim pengingat",
    description: "Template WA siap pakai",
    icon: "logo-whatsapp" as const,
  },
  {
    id: "share",
    label: "Bagikan ringkasan",
    description: "Keluar sebagai PDF/CSV",
    icon: "share-social-outline" as const,
  },
  {
    id: "note",
    label: "Catatan cepat",
    description: "Simak janji pembayaran",
    icon: "document-text-outline" as const,
  },
];

export default function TotalScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500">Outstanding</Text>
            <Text className="text-3xl font-semibold text-slate-900">Rp12.500.000</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="rounded-full bg-white p-3">
              <Ionicons name="notifications-outline" size={20} color="#0f172a" />
            </View>

            <Button label="+ Tambah" variant="primary" onPress={() => router.push("/debt/new")} />
          </View>
        </View>

        <Text className="mt-6 text-sm text-slate-500">Ringkasan minggu ini</Text>

        <View className="mt-3 flex-row gap-3">
          <StatCard
            label="Total Hutang"
            amount={12500000}
            tone="dark"
            description="4 kontak belum bayar"
            icon={<Ionicons name="wallet-outline" size={18} color="#f8fafc" />}
            className="flex-1"
          />
          <StatCard
            label="Jatuh Tempo"
            amount={3200000}
            tone="accent"
            description="2 tagihan minggu ini"
            trendLabel="Turun 12% dari minggu lalu"
            trendIsPositive
            icon={<Ionicons name="alarm-outline" size={18} color="#065f46" />}
            className="flex-1"
          />
        </View>

        <View className="mt-3 flex-row gap-3">
          <StatCard
            label="Tertagih bulan ini"
            amount={8200000}
            description="3 pembayaran selesai"
            icon={<Ionicons name="sparkles-outline" size={18} color="#0f172a" />}
            className="flex-1"
          />
          <StatCard
            label="Reminder aktif"
            amount={5}
            showCurrency={false}
            description="terjadwal via WA & email"
            icon={<Ionicons name="send-outline" size={18} color="#0f172a" />}
            className="flex-1"
          />
        </View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-slate-900">Hutang terdekat</Text>
          <Text className="text-sm text-slate-500">Lihat semua</Text>
        </View>

        <View className="mt-4 space-y-3">
          {upcomingDebts.map((debt) => (
            <DebtCard
              key={debt.id}
              debtor={debt.debtor}
              amount={debt.amount}
              dueDate={debt.dueDate}
              note={debt.note}
              status={debt.status}
            />
          ))}
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold text-slate-900">Aksi cepat</Text>
          <View className="mt-4 gap-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} {...action} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type QuickAction = (typeof quickActions)[number];

function QuickActionCard({ label, description, icon }: QuickAction) {
  return (
    <View className="flex-row items-center justify-between rounded-3xl border border-slate-100 bg-white p-4">
      <View className="flex-row items-center gap-3">
        <View className="rounded-2xl bg-slate-100 p-3">
          <Ionicons name={icon} size={20} color="#0f172a" />
        </View>
        <View>
          <Text className="text-base font-semibold text-slate-900">{label}</Text>
          <Text className="text-sm text-slate-500">{description}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </View>
  );
}
