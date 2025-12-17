import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function NewDebtScreen() {
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
          <Input label="Nama kontak" placeholder="Contoh: Mega Putri" />
          <Input label="Jumlah hutang (IDR)" keyboardType="number-pad" placeholder="0" />
          <Input label="Jatuh tempo" placeholder="12 Juni 2025" />
          <Input
            label="Catatan"
            placeholder="Detail tambahan"
            multiline
            className="min-h-[100px]"
          />
        </View>

        <View className="mt-10 gap-4">
          <Button label="Simpan hutang" onPress={() => router.back()} />
          <Button label="Batalkan" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
