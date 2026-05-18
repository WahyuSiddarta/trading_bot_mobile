import "react-native-reanimated";
import "./global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { PrivateAlertStrip } from "@/components/private-alert-strip";
import { ToastProvider } from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";
import { useSecurityStore } from "@/stores/security-store";

SplashScreen.preventAutoHideAsync();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.tint,
  },
};

export const unstable_settings = {
  anchor: "(auth)",
};

export default function RootLayout() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isLoadingSecurity = useSecurityStore(
    (state) => state.isLoadingSecurity,
  );
  const hydrateSecurity = useSecurityStore((state) => state.hydrateSecurity);
  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic.ttf"),
    "Inter-BoldItalic": require("../assets/fonts/Inter-BoldItalic.ttf"),
  });
  const isFontReady = loaded || Boolean(error);

  useEffect(() => {
    if (error) {
      console.warn(
        "Font loading failed. Continuing with fallback fonts.",
        error,
      );
    }
  }, [error]);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    hydrateSecurity();
  }, [hydrateSecurity]);

  useEffect(() => {
    if (isFontReady && !isLoading && !isLoadingSecurity) {
      SplashScreen.hideAsync();
    }
  }, [isFontReady, isLoading, isLoadingSecurity]);

  if (!isFontReady || isLoading || isLoadingSecurity) {
    return <View />;
  }

  return <RootNavigator />;
}

function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const biometricUnlockEnabled = useSecurityStore(
    (state) => state.biometricUnlockEnabled,
  );
  const rootNavigationState = useRootNavigationState();
  const segments = useSegments();
  const router = useRouter();
  const appStateRef = useRef(AppState.currentState);
  const isAuthenticatingRef = useRef(false);

  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/register");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, rootNavigationState?.key, router, segments]);

  useEffect(() => {
    const requestUnlock = async () => {
      if (
        isAuthenticatingRef.current ||
        !isAuthenticated ||
        !biometricUnlockEnabled
      ) {
        return;
      }

      isAuthenticatingRef.current = true;

      try {
        await LocalAuthentication.authenticateAsync({
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
          promptMessage: "Unlock your account",
        });
      } finally {
        isAuthenticatingRef.current = false;
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (
        previousAppState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        requestUnlock();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [biometricUnlockEnabled, isAuthenticated]);

  const shouldShowPrivateAlertStrip =
    isAuthenticated && segments[0] !== "(auth)" && segments[0] !== "(tabs)";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={AppTheme}>
        <ToastProvider>
          <GestureHandlerRootView className="flex-1">
            <BottomSheetModalProvider>
              <View className="flex-1 bg-background">
                {shouldShowPrivateAlertStrip ? <PrivateAlertStrip /> : null}
                <Stack>
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </View>
              <StatusBar style="auto" />
              <PortalHost />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
