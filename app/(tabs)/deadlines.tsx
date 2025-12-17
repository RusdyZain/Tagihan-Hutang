import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const timeline = [
  {
    id: "today",
    day: "Hari ini",
    entries: [
      {
        debtor: "Mega Putri",
        action: "Follow-up pembayaran DP",
        time: "09.00",
        status: "overdue" as const,
      },
    ],
  },
  {
    id: "tomorrow",
    day: "Besok",
    entries: [
      {
        debtor: "Deny Prasetyo",
        action: "Kirim invoice final",
        time: "10.30",
        status: "upcoming" as const,
      },
      {
        debtor: "Andi Wirawan",
        action: "Konfirmasi jadwal transfer",
        time: "14.00",
        status: "upcoming" as const,
      },
    ],
  },
];

export default function DeadlinesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm text-slate-500">Reminder terjadwal</Text>
        <Text className="mt-1 text-2xl font-semibold text-slate-900">Timeline pengingat</Text>

        <View className="mt-6">
          {timeline.map((group) => (
            <View key={group.id} className="mb-8">
              <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {group.day}
              </Text>

              {group.entries.map((entry, idx) => (
                <View key={`${group.id}-${idx}`} className="flex-row">
                  <View className="items-center">
                    <View className="h-4 w-4 rounded-full bg-slate-900" />
                    {idx !== group.entries.length - 1 ? (
                      <View className="flex-1 border-l border-dashed border-slate-200" />
                    ) : null}
                  </View>
                  <View className="ml-4 flex-1 rounded-3xl border border-slate-100 bg-white p-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-slate-900">{entry.debtor}</Text>
                      <View
                        className={`rounded-full px-3 py-1 ${
                          entry.status === "overdue" ? "bg-rose-50" : "bg-emerald-50"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            entry.status === "overdue" ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {entry.status === "overdue" ? "Overdue" : "Upcoming"}
                        </Text>
                      </View>
                    </View>
                    <Text className="mt-1 text-base text-slate-900">{entry.action}</Text>
                    <View className="mt-3 flex-row items-center gap-2">
                      <Ionicons name="time-outline" size={16} color="#475569" />
                      <Text className="text-sm text-slate-500">{entry.time} WIB</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
