import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useRef, useState } from "react";

import { Animated, Pressable, Text, TextInput, View } from "react-native";

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
  const passwordIconColor = error
    ? "#f87171"
    : isActive
      ? "#e5fff0"
      : hasValidState
        ? "#22c55e"
        : "#94a3b8";

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
            className="absolute left-3.5 z-10 flex-row items-center gap-1 px-1"
            pointerEvents="none"
            style={labelContainerStyle}
          >
            <Animated.Text className="font-medium" style={labelTextStyle}>
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
          disabled={!editable}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          className="ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-slate-800/70 disabled:opacity-50"
        >
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={18}
            color={passwordIconColor}
          />
        </Pressable>
      </View>
      {error && (
        <Text className="text-xs font-medium text-red-400">{error}</Text>
      )}
    </View>
  );
}
