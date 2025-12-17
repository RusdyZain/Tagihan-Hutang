import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";
import { Input } from "@/components/Input";
import type { Debt } from "@/lib/debtRepo";
import { deleteDebt, getDebt, setPaid, updateDebt } from "@/lib/debtRepo";
import { buildWaMessage, openWhatsApp } from "@/lib/reminder";

export default function DebtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const [debt, setDebt] = useState<Debt | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const loadDebt = useCallback(() => {
    if (!Number.isFinite(numericId)) {
      return;
    }
    const data = getDebt(numericId);
    setDebt(data);
    setNote(data?.note ?? "");
  }, [numericId]);

  useEffect(() => {
    loadDebt();
  }, [loadDebt]);

  if (!debt) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-5">
        <Text className="text-center text-base text-slate-500">
          Data hutang tidak ditemukan atau sudah dihapus.
        </Text>
        <Button label="Kembali" className="mt-6" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = updateDebt(debt.id, { note: note.trim() || null });
      if (updated) {
        setDebt(updated);
      }
    } catch (error) {
      Alert.alert("Gagal memperbarui", (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handlePaidToggle = (value: boolean) => {
    const updated = setPaid(debt.id, value);
    if (updated) {
      setDebt(updated);
    }
  };

  const handleDelete = () => {
    Alert.alert("Hapus hutang", "Hapus data ini secara permanen?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteDebt(debt.id);
          router.back();
        },
      },
    ]);
  };

  const handleWhatsApp = async () => {
    const message = buildWaMessage(debt);
    await openWhatsApp(debt.phone, message);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500">Detail hutang</Text>
            <Text className="mt-1 text-2xl font-semibold text-slate-900">
              {debt.debtorName}
            </Text>
          </View>

          <Button
            label="Tutup"
            variant="secondary"
            onPress={() => router.back()}
            leftIcon={<Ionicons name="chevron-back" size={16} color="#0f172a" />}
          />
        </View>

        <View className="mt-6">
          <DebtCard
            debtor={debt.debtorName}
            amount={debt.amount}
            dueDate={new Date(debt.dueDate)}
            note={debt.note ?? undefined}
            status={deriveCardStatus(debt)}
          />
          <View className="mt-4 flex-row items-center gap-3">
            <Button
              label={debt.status === "PAID" ? "Tandai belum lunas" : "Tandai lunas"}
              variant="primary"
              onPress={() => handlePaidToggle(debt.status !== "PAID")}
            />
            <Button label="Kirim WA" variant="secondary" onPress={handleWhatsApp} />
          </View>
        </View>

        <View className="mt-10 space-y-5">
          <Input
            label="Catatan internal"
            placeholder="Contoh: sudah follow up via WA"
            multiline
            value={note}
            onChangeText={setNote}
          />
          <Input
            label="Nomor WA"
            value={debt.phone}
            editable={false}
            helperText="Hubungi kontak langsung dengan tombol Kirim WA"
          />
        </View>

        <View className="mt-10 gap-4">
          <Button label="Simpan perubahan" onPress={handleSave} disabled={saving} />
          <Button label="Hapus hutang" variant="secondary" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function deriveCardStatus(debt: Debt) {
  if (debt.status === "PAID") {
    return "scheduled" as const;
  }
  const due = new Date(debt.dueDate);
  const now = new Date();
  if (due < now) {
    return "overdue" as const;
  }
  const soon = new Date();
  soon.setDate(now.getDate() + 3);
  if (due <= soon) {
    return "urgent" as const;
  }
  return "scheduled" as const;
}
