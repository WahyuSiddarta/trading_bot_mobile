import Icon from "@expo/vector-icons/FontAwesome5";
import { Pressable, PressableProps, Text } from "react-native";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-green-500",
  secondary: "border border-slate-700 bg-slate-900",
  ghost: "bg-transparent",
};

const textVariantClassNames: Record<ButtonVariant, string> = {
  primary: "text-emerald-950",
  secondary: "text-emerald-50",
  ghost: "text-green-500",
};

const iconVariantColors: Record<ButtonVariant, string> = {
  primary: "#022c22",
  secondary: "#ecfdf5",
  ghost: "#22c55e",
};

const sizeClassNames: Record<ButtonSize, string> = {
  md: "min-h-12 rounded-xl px-4",
  lg: "min-h-14 rounded-2xl px-5",
};

const iconSize: Record<ButtonSize, number> = {
  md: 16,
  lg: 18,
};

export function Button({
  title,
  loadingTitle,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const displayTitle = loading ? (loadingTitle ?? title) : title;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center gap-2 active:opacity-85 disabled:opacity-60",
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <Icon
          name="spinner"
          size={iconSize[size]}
          color={iconVariantColors[variant]}
          className="animate-spin"
        />
      )}
      <Text
        className={cn(
          "text-base font-bold tracking-wide",
          textVariantClassNames[variant],
          textClassName,
        )}
      >
        {displayTitle}
      </Text>
    </Pressable>
  );
}
