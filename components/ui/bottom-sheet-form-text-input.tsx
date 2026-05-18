import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ReactNode, useEffect, useState } from "react";
import { Text, TextInputProps, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface BottomSheetFormTextInputProps extends Pick<
  TextInputProps,
  | "autoCapitalize"
  | "autoComplete"
  | "keyboardType"
  | "returnKeyType"
  | "textContentType"
> {
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
  prepend?: ReactNode;
  append?: ReactNode;
}

export function BottomSheetFormTextInput({
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
  prepend,
  append,
  autoCapitalize = "sentences",
  autoComplete,
  keyboardType = "default",
  returnKeyType,
  textContentType,
}: BottomSheetFormTextInputProps) {
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
        {prepend && <View className="mr-2">{prepend}</View>}
        <BottomSheetTextInput
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 py-3 text-base font-medium text-emerald-50"
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          textContentType={textContentType}
        />
        {append && <View className="ml-2">{append}</View>}
      </View>
      {error && (
        <Text className="text-xs font-medium text-red-400">{error}</Text>
      )}
    </View>
  );
}
