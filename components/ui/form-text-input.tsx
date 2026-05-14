import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";

interface FormTextInputProps {
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

export function FormTextInput({
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
}: FormTextInputProps) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isFloating = isFocused || isInputFocused || Boolean(value);
  const labelProgress = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelProgress, {
      toValue: isFloating ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFloating, labelProgress]);

  const labelContainerStyle = {
    backgroundColor:
      isFocused || isInputFocused ? "#0f172a" : error ? "#020617" : "#020617",
    top: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [17, -9],
    }),
  };

  const labelTextStyle = {
    fontSize: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    lineHeight: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 16],
    }),
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    onBlur?.();
  };

  return (
    <View className="gap-2 pt-2">
      <View
        className={`rounded-2xl border-2 flex-row items-center px-4 ${
          isFloating ? "pt-1" : ""
        } ${
          isFocused || isInputFocused
            ? "border-green-500 bg-slate-900"
            : error
              ? "border-red-500 bg-slate-950"
              : "border-slate-800 bg-slate-950"
        }`}
      >
        {label && (
          <Animated.View
            pointerEvents="none"
            style={[styles.labelContainer, labelContainerStyle]}
          >
            <Animated.Text style={[styles.label, labelTextStyle]}>
              {label}
            </Animated.Text>
            {required && <Text className="text-red-400 font-bold">*</Text>}
          </Animated.View>
        )}
        {prepend && <View className="mr-2">{prepend}</View>}
        <TextInput
          placeholder={label && !isFloating ? undefined : placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 text-base font-medium text-emerald-50 py-4"
          keyboardType="default"
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoCapitalize="sentences"
        />
        {append && <View className="ml-2">{append}</View>}
      </View>
      {error && (
        <Text className="text-xs font-medium text-red-400">{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: "center",
    backgroundColor: "#020617",
    flexDirection: "row",
    gap: 4,
    left: 14,
    paddingHorizontal: 4,
    position: "absolute",
    zIndex: 1,
  },
  label: {
    color: "#5a7a94",
    fontWeight: "500",
  },
});
