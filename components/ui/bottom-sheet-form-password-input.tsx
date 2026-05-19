import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Eye, EyeClosed } from "lucide-react-native";
import { ReactNode, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface BottomSheetFormPasswordInputProps {
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
  append?: ReactNode;
}

export function BottomSheetFormPasswordInput({
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
  append,
}: BottomSheetFormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isFloating = isFocused || isInputFocused || Boolean(value);
  const isActive = isFocused || isInputFocused;
  const hasValidState = isValid && !error;
  const labelProgress = useSharedValue(isFloating ? 1 : 0);

  useEffect(() => {
    labelProgress.value = withTiming(isFloating ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
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
  const labelBackgroundColor =
    isActive || hasValidState ? "#0f172a" : "#020617";
  const labelColor = error
    ? "#f87171"
    : isActive
      ? "#ffffff"
      : hasValidState
        ? "#22c55e"
        : "#5a7a94";

  const labelContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      labelProgress.value,
      [0, 1],
      ["#020617", labelBackgroundColor],
    ),
    top: interpolate(labelProgress.value, [0, 1], [14, -9]),
  }));
  const labelTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(labelProgress.value, [0, 1], [16, 12]),
    lineHeight: interpolate(labelProgress.value, [0, 1], [22, 16]),
  }));
  const passwordIconColor = error
    ? "#f87171"
    : isActive
      ? "#e5fff0"
      : hasValidState
        ? "#22c55e"
        : "#94a3b8";
  const PasswordIcon = showPassword ? Eye : EyeClosed;

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
            <Animated.Text
              className="font-medium"
              numberOfLines={1}
              style={[labelTextStyle, { color: labelColor }]}
            >
              {label}
            </Animated.Text>
            {required && <Text className="font-bold text-red-400">*</Text>}
          </Animated.View>
        )}
        <BottomSheetTextInput
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 py-3 text-base font-medium text-emerald-50"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoCapitalize="none"
        />
        {append && <View className="ml-2">{append}</View>}
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          disabled={!editable}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          className="items-center justify-center w-10 h-10 ml-2 rounded-full active:bg-slate-800/70 disabled:opacity-50"
        >
          <PasswordIcon size={20} color={passwordIconColor} strokeWidth={2.2} />
        </Pressable>
      </View>
      {error && (
        <Text className="text-xs font-medium text-red-400">{error}</Text>
      )}
    </View>
  );
}
