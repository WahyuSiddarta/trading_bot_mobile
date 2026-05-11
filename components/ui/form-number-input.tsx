import { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

interface FormNumberInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  required?: boolean;
  error?: string;
  editable?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
}

export function FormNumberInput({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused = false,
  required = false,
  error,
  editable = true,
  prepend,
  append,
}: FormNumberInputProps) {
  return (
    <View className="gap-2">
      {label && (
        <View className="flex-row gap-1">
          <Text className="text-sm font-semibold text-slate-300">{label}</Text>
          {required && <Text className="text-red-400 font-bold">*</Text>}
        </View>
      )}
      <View
        className={`rounded-2xl border-2 overflow-hidden flex-row items-center px-4 transition-all ${
          isFocused
            ? "border-green-500 bg-slate-900"
            : error
              ? "border-red-500 bg-slate-950"
              : "border-slate-800 bg-slate-950"
        }`}
      >
        {prepend && <View className="mr-2">{prepend}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 text-base font-medium text-emerald-50 py-4"
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          autoCapitalize="none"
        />
        {append && <View className="ml-2">{append}</View>}
      </View>
      {error && (
        <Text className="text-xs font-medium text-red-400">{error}</Text>
      )}
    </View>
  );
}
