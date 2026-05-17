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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ToastProvider } from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";

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
      console.warn("Font loading failed. Continuing with fallback fonts.", error);
    }
  }, [error]);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (isFontReady && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isFontReady, isLoading]);

  if (!isFontReady || isLoading) {
    return <View />;
  }

  return <RootNavigator />;
}

function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const rootNavigationState = useRootNavigationState();
  const segments = useSegments();
  const router = useRouter();

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={AppTheme}>
        <ToastProvider>
          <GestureHandlerRootView className="flex-1">
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
              <PortalHost />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
