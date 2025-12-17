import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DebtCard } from "@/components/DebtCard";
import { Input } from "@/components/Input";

export default function DebtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
            <Text className="mt-1 text-2xl font-semibold text-slate-900">Invoice #{id}</Text>
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
            debtor="Placeholder"
            amount={2500000}
            dueDate={new Date()}
            note="Detail hutang akan ditarik dari DB"
            status="scheduled"
          />
        </View>

        <View className="mt-10 space-y-5">
          <Input label="Catatan internal" placeholder="Contoh: sudah follow up via WA" multiline />
          <Input label="Reminder berikutnya" placeholder="22 Jan 2025" />
        </View>

        <View className="mt-10 gap-4">
          <Button label="Simpan perubahan" onPress={() => router.back()} />
          <Button label="Tandai lunas" variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
