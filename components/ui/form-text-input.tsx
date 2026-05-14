import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface FormTextInputProps
  extends Pick<
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
  isValid = false,
  editable = true,
  prepend,
  append,
  autoCapitalize = "sentences",
  autoComplete,
  keyboardType = "default",
  returnKeyType,
  textContentType,
}: FormTextInputProps) {
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
        {prepend && <View className="mr-2">{prepend}</View>}
        <TextInput
          placeholder={label ? (isFloating ? placeholder : "") : placeholder}
          placeholderTextColor="#5a7a94"
          className="flex-1 text-base font-medium text-emerald-50 py-3"
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
