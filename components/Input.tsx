import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { Text, TextInput, View } from "react-native";

type InputProps = ComponentProps<typeof TextInput> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, helperText, errorText, className = "", containerClassName = "", ...rest },
  ref,
) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? <Text className="mb-1 text-sm font-medium text-slate-600">{label}</Text> : null}

      <TextInput
        ref={ref}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 ${className}`}
        placeholderTextColor="#94a3b8"
        {...rest}
      />

      {helperText && !errorText ? (
        <Text className="mt-1 text-xs text-slate-500">{helperText}</Text>
      ) : null}

      {errorText ? <Text className="mt-1 text-xs text-rose-500">{errorText}</Text> : null}
    </View>
  );
});
