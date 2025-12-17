import type { ReactNode } from "react";
import { Text, View } from "react-native";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

type StatCardProps = {
  label: string;
  amount: number;
  description?: string;
  tone?: "dark" | "accent" | "muted";
  showCurrency?: boolean;
  icon?: ReactNode;
  trendLabel?: string;
  trendIsPositive?: boolean;
  className?: string;
};

export function StatCard({
  label,
  amount,
  description,
  tone = "muted",
  showCurrency = true,
  icon,
  trendLabel,
  trendIsPositive,
  className = "",
}: StatCardProps) {
  const toneClasses =
    tone === "dark"
      ? "bg-slate-900"
      : tone === "accent"
        ? "bg-emerald-50 border border-emerald-100"
        : "bg-white border border-slate-100";
  const textClass = tone === "dark" ? "text-white" : "text-slate-900";
  const subTextClass = tone === "dark" ? "text-slate-300" : "text-slate-500";

  return (
    <View className={`rounded-3xl p-4 ${toneClasses} ${className}`}>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className={`text-sm font-medium uppercase tracking-wide ${subTextClass}`}>{label}</Text>
        {icon ? <View className="rounded-2xl bg-white/10 p-2">{icon}</View> : null}
      </View>

      <Text className={`text-2xl font-semibold leading-tight ${textClass}`}>
        {showCurrency ? currencyFormatter.format(amount) : amount.toLocaleString("id-ID")}
      </Text>

      {description ? <Text className={`mt-1 text-sm ${subTextClass}`}>{description}</Text> : null}

      {trendLabel ? (
        <Text
          className={`mt-3 text-sm font-medium ${
            trendIsPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {trendLabel}
        </Text>
      ) : null}
    </View>
  );
}
