import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { createDebt } from "@/lib/debtRepo";

export default function NewDebtScreen() {
  const [debtorName, setDebtorName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (submitting) return;
    const errors: string[] = [];
    if (!debtorName.trim()) {
      errors.push("Nama kontak wajib diisi.");
    }
    if (!phone.trim() || !phone.startsWith("62")) {
      errors.push("Nomor telepon harus diawali 62 dan tidak boleh kosong.");
    }
    const amountValue = Number(amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      errors.push("Jumlah hutang harus lebih dari 0.");
    }
    const parsedDue = new Date(dueDate);
    if (!dueDate.trim() || Number.isNaN(parsedDue.getTime())) {
      errors.push("Tanggal jatuh tempo tidak valid (format YYYY-MM-DD).");
    }

    if (errors.length) {
      Alert.alert("Form belum lengkap", errors.join("\n"));
      return;
    }

    try {
      setSubmitting(true);
      const created = createDebt({
        debtorName: debtorName.trim(),
        phone: phone.trim(),
        amount: amountValue,
        dueDate: parsedDue.toISOString(),
        note: note.trim() || null,
      });
      router.replace({ pathname: "/debt/[id]", params: { id: String(created.id) } });
    } catch (error) {
      Alert.alert("Gagal menyimpan", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-slate-500">Tambah hutang baru</Text>
        <Text className="mt-1 text-2xl font-semibold text-slate-900">
          Catat detail hutang dan reminder
        </Text>

        <View className="mt-8 space-y-5">
          <Input
            label="Nama kontak"
            placeholder="Contoh: Mega Putri"
            value={debtorName}
            onChangeText={setDebtorName}
          />
          <Input
            label="Nomor WA (62...)"
            placeholder="628123456789"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            label="Jumlah hutang (IDR)"
            keyboardType="number-pad"
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
          />
          <Input
            label="Jatuh tempo"
            placeholder="2025-06-12"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <Input
            label="Catatan"
            placeholder="Detail tambahan"
            multiline
            className="min-h-[100px]"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View className="mt-10 gap-4">
          <Button label="Simpan hutang" onPress={handleSubmit} disabled={submitting} />
          <Button label="Batalkan" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
