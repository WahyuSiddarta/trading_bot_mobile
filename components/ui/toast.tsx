import Icon from "@expo/vector-icons/FontAwesome5";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "warning";

type ToastOptions = {
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastState = Required<Pick<ToastOptions, "title" | "variant">> &
  Pick<ToastOptions, "message" | "duration"> & {
    id: number;
  };

type ToastContextValue = {
  show: (options: ToastOptions) => void;
  success: (title: string, message?: string, options?: ToastMethodOptions) => void;
  error: (title: string, message?: string, options?: ToastMethodOptions) => void;
  info: (title: string, message?: string, options?: ToastMethodOptions) => void;
  warning: (title: string, message?: string, options?: ToastMethodOptions) => void;
  hide: () => void;
};

type ToastMethodOptions = Omit<ToastOptions, "title" | "message" | "variant">;

const DEFAULT_DURATION = 3000;

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<
  ToastVariant,
  {
    container: string;
    icon: string;
    iconName: string;
    title: string;
    message: string;
  }
> = {
  success: {
    container: "border-emerald-500/40 bg-emerald-950",
    icon: "#34d399",
    iconName: "check-circle",
    title: "text-emerald-50",
    message: "text-emerald-100/80",
  },
  error: {
    container: "border-red-500/40 bg-red-950",
    icon: "#f87171",
    iconName: "times-circle",
    title: "text-red-50",
    message: "text-red-100/80",
  },
  info: {
    container: "border-sky-500/40 bg-sky-950",
    icon: "#38bdf8",
    iconName: "info-circle",
    title: "text-sky-50",
    message: "text-sky-100/80",
  },
  warning: {
    container: "border-amber-500/40 bg-amber-950",
    icon: "#fbbf24",
    iconName: "exclamation-circle",
    title: "text-amber-50",
    message: "text-amber-100/80",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

  const clearToastTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearToastTimeout();
    setToast(null);
  }, [clearToastTimeout]);

  const show = useCallback(
    ({ title, message, variant = "info", duration = DEFAULT_DURATION }: ToastOptions) => {
      clearToastTimeout();

      const nextToast = {
        id: toastIdRef.current + 1,
        title,
        message,
        variant,
        duration,
      };

      toastIdRef.current = nextToast.id;
      setToast(nextToast);

      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          setToast((currentToast) =>
            currentToast?.id === nextToast.id ? null : currentToast,
          );
        }, duration);
      }
    },
    [clearToastTimeout],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      hide,
      success: (title, message, options) =>
        show({ title, message, variant: "success", ...options }),
      error: (title, message, options) =>
        show({ title, message, variant: "error", ...options }),
      info: (title, message, options) =>
        show({ title, message, variant: "info", ...options }),
      warning: (title, message, options) =>
        show({ title, message, variant: "warning", ...options }),
    }),
    [hide, show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost toast={toast} onClose={hide} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

function ToastHost({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [visibleToast, setVisibleToast] = useState<ToastState | null>(toast);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-16);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (toast) {
      setVisibleToast(toast);
      opacity.value = 0;
      translateY.value = -16;
      opacity.value = withTiming(1, { duration: 180 });
      translateY.value = withTiming(0, { duration: 180 });
      return;
    }

    opacity.value = withTiming(0, { duration: 140 }, (finished) => {
      if (finished) {
        runOnJS(setVisibleToast)(null);
      }
    });
    translateY.value = withTiming(-16, { duration: 140 });
  }, [opacity, toast, translateY]);

  if (!visibleToast) {
    return null;
  }

  const styles = toastStyles[visibleToast.variant];

  return (
    <Animated.View
      pointerEvents="box-none"
      className="absolute inset-x-0 z-50 px-4"
      style={[{ top: insets.top + 12 }, animatedStyle]}
    >
      <Pressable
        accessibilityRole="alert"
        onPress={onClose}
        className={cn(
          "mx-auto w-full max-w-xl flex-row items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg active:opacity-90",
          styles.container,
        )}
      >
        <Icon name={styles.iconName} size={18} color={styles.icon} />
        <View className="min-w-0 flex-1">
          <Text className={cn("text-sm font-bold", styles.title)}>
            {visibleToast.title}
          </Text>
          {!!visibleToast.message && (
            <Text className={cn("mt-1 text-xs leading-5", styles.message)}>
              {visibleToast.message}
            </Text>
          )}
        </View>
        <Icon name="times" size={14} color="rgba(255,255,255,0.7)" />
      </Pressable>
    </Animated.View>
  );
}
