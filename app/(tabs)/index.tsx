import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";
import { StatCard } from "@/components/StatCard";
import type { Debt } from "@/lib/debtRepo";
import { deadlineBuckets, listDebts, totals } from "@/lib/debtRepo";
import { runReminderSweep } from "@/lib/reminder";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

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
  const [statTotals, setStatTotals] = useState({ outstanding: 0, overdue: 0 });
  const [upcomingDebts, setUpcomingDebts] = useState<Debt[]>([]);
  const [activeUnpaidCount, setActiveUnpaidCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [bucketCount, setBucketCount] = useState(0);

  const refresh = useCallback(() => {
    const totalsResult = totals();
    const unpaid = listDebts({ status: "UNPAID" });
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 7);

    setStatTotals(totalsResult);
    setActiveUnpaidCount(unpaid.length);
    setDueSoonCount(
      unpaid.filter((debt) => {
        const due = new Date(debt.dueDate);
        return due >= now && due <= soon;
      }).length,
    );
    setUpcomingDebts(unpaid.slice(0, 3));
    setBucketCount(deadlineBuckets().reduce((count, section) => count + section.data.length, 0));
    void runReminderSweep();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleQuickAction = async (actionId: QuickAction["id"]) => {
    if (actionId === "reminder") {
      const success = await runReminderSweep();
      Alert.alert(
        success ? "Pengingat dijalankan" : "Tidak dapat mengirim",
        success
          ? "Reminder otomatis akan muncul untuk hutang yang belum diingatkan 3 hari terakhir."
          : "Fitur notifikasi hanya tersedia di development build/production.",
      );
      return;
    }

    if (actionId === "note") {
      router.push("/quick-note");
      return;
    }

    if (actionId === "share") {
      Alert.alert(
        "Segera hadir",
        "Bagikan ringkasan sebagai PDF/CSV akan ditambahkan pada rilis berikutnya.",
      );
    }
  };

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
            <Text className="text-3xl font-semibold text-slate-900">
              {currencyFormatter.format(statTotals.outstanding)}
            </Text>
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
            amount={statTotals.outstanding}
            tone="dark"
            description={`${activeUnpaidCount} kontak belum bayar`}
            icon={<Ionicons name="wallet-outline" size={18} color="#f8fafc" />}
            className="flex-1"
          />
          <StatCard
            label="Overdue"
            amount={statTotals.overdue}
            tone="accent"
            description={
              statTotals.overdue > 0 ? "Segera tindak lanjuti" : "Tidak ada yang terlambat"
            }
            icon={<Ionicons name="alarm-outline" size={18} color="#065f46" />}
            className="flex-1"
          />
        </View>

        <View className="mt-3 flex-row gap-3">
          <StatCard
            label="Due 7 hari"
            amount={dueSoonCount}
            showCurrency={false}
            description="Perlu reminder cepat"
            icon={<Ionicons name="time-outline" size={18} color="#0f172a" />}
            className="flex-1"
          />
          <StatCard
            label="Reminder aktif"
            amount={bucketCount}
            showCurrency={false}
            description="Terjadwal via WA & notif"
            icon={<Ionicons name="send-outline" size={18} color="#0f172a" />}
            className="flex-1"
          />
        </View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-slate-900">Hutang terdekat</Text>
          <Text className="text-sm text-slate-500">Lihat semua</Text>
        </View>

        <View className="mt-4 space-y-3">
          {upcomingDebts.length === 0 ? (
            <View className="rounded-3xl border border-dashed border-slate-200 bg-white p-6">
              <Text className="text-center text-sm text-slate-500">
                Belum ada hutang aktif. Tambahkan data untuk mulai memantau.
              </Text>
            </View>
          ) : (
            upcomingDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debtor={debt.debtorName}
                amount={debt.amount}
                dueDate={new Date(debt.dueDate)}
                note={debt.note ?? undefined}
                status={deriveCardStatus(debt.dueDate)}
              />
            ))
          )}
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold text-slate-900">Aksi cepat</Text>
          <View className="mt-4 gap-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} {...action} onPress={() => handleQuickAction(action.id)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type QuickAction = (typeof quickActions)[number];

function deriveCardStatus(dueDate: string) {
  const due = new Date(dueDate);
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 3);

  if (due < now) {
    return "overdue" as const;
  }

  if (due <= soon) {
    return "urgent" as const;
  }

  return "scheduled" as const;
}

function QuickActionCard({
  label,
  description,
  icon,
  onPress,
}: QuickAction & { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 active:opacity-80"
    >
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
    </Pressable>
  );
}
