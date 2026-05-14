import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface FormPasswordInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  required?: boolean;
  error?: string;
  isValid?: boolean;
  editable?: boolean;
}

export function FormPasswordInput({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused = false,
  required = false,
  error,
  isValid = false,
  editable = true,
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isFloating = isFocused || isInputFocused || Boolean(value);
  const isActive = isFocused || isInputFocused;
  const hasValidState = isValid && !error;
  const labelProgress = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelProgress, {
      toValue: isFloating ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFloating, labelProgress]);

  const inputContainerClassName = `rounded-2xl border-2 flex-row items-center px-4 ${
    label ? "pt-1" : ""
  } ${
    error
      ? "border-red-500 bg-slate-950"
      : hasValidState
        ? "border-green-500 bg-slate-900"
        : isActive
          ? "border-sky-400 bg-slate-900"
          : "border-slate-800 bg-slate-950"
  }`;
  const labelContainerStyle = {
    backgroundColor: isActive || hasValidState ? "#0f172a" : "#020617",
    top: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -9],
    }),
  };
  const labelTextStyle = {
    color: error
      ? "#f87171"
      : isActive
        ? "#ffffff"
        : hasValidState
          ? "#22c55e"
          : "#5a7a94",
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
      <View className={inputContainerClassName}>
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
        <TextInput
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 text-base font-medium text-emerald-50 py-3"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoCapitalize="none"
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          className="active:opacity-70"
        >
          <Text className="text-base text-slate-400">
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </Text>
        </Pressable>
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
