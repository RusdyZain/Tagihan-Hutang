import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type ButtonProps = ComponentProps<typeof Pressable> & {
  label: string;
  className?: string;
  textClassName?: string;
  variant?: "primary" | "secondary" | "ghost";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({
  label,
  variant = "primary",
  className = "",
  textClassName = "",
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}: ButtonProps) {
  const baseButton =
    "flex-row items-center justify-center rounded-2xl px-4 py-3 active:opacity-70";
  const variantClass =
    variant === "primary"
      ? "bg-slate-900"
      : variant === "secondary"
        ? "bg-slate-100"
        : "bg-transparent";
  const textColor =
    variant === "primary" ? "text-white" : variant === "secondary" ? "text-slate-900" : "text-slate-500";

  return (
    <Pressable
      className={`${baseButton} ${variantClass} ${disabled ? "opacity-50" : ""} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
      <Text className={`text-base font-semibold ${textColor} ${textClassName}`}>{label}</Text>
      {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
    </Pressable>
  );
}
