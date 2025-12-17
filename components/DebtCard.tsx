import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

type DebtCardStatus = "overdue" | "urgent" | "scheduled";

type DebtCardProps = {
  debtor: string;
  amount: number;
  dueDate: Date;
  note?: string;
  status?: DebtCardStatus;
  trailing?: ReactNode;
  className?: string;
};

const statusCopies: Record<
  DebtCardStatus,
  { text: string; bgClass: string; textClass: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  overdue: {
    text: "Terlambat",
    bgClass: "bg-rose-50",
    textClass: "text-rose-600",
    icon: "warning-outline",
  },
  urgent: {
    text: "Jatuh tempo",
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
    icon: "alarm-outline",
  },
  scheduled: {
    text: "Terjadwal",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
    icon: "calendar-outline",
  },
};

export function DebtCard({
  debtor,
  amount,
  dueDate,
  note,
  status = "scheduled",
  trailing,
  className = "",
}: DebtCardProps) {
  const statusInfo = statusCopies[status];

  return (
    <View className={`flex-row items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 ${className}`}>
      <View className="flex-1 pr-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-semibold text-slate-900">{debtor}</Text>
          <View className={`rounded-full px-2 py-0.5 ${statusInfo.bgClass}`}>
            <Text className={`text-xs font-semibold ${statusInfo.textClass}`}>{statusInfo.text}</Text>
          </View>
        </View>
        <Text className="mt-2 text-xl font-semibold text-slate-900">
          {currencyFormatter.format(amount)}
        </Text>
        <Text className="mt-1 text-sm text-slate-500">{dateFormatter.format(dueDate)}</Text>
        {note ? <Text className="mt-1 text-sm text-slate-400">{note}</Text> : null}
      </View>

      {trailing ? (
        <View className="items-center">{trailing}</View>
      ) : (
        <View className="items-center">
          <Ionicons name={statusInfo.icon} size={24} color="#0f172a" />
        </View>
      )}
    </View>
  );
}
