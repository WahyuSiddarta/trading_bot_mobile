import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { FormPasswordInput } from "@/components/ui/form-password-input";
import { FormTextInput } from "@/components/ui/form-text-input";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    login();
    router.replace("/");
  };

  return (
    <LinearGradient
      colors={["#01040a", "#0a1620", "#01040a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocusedInput(null);
        }}
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Animated gradient accent */}
          <View className="absolute inset-0 opacity-20 overflow-hidden">
            <View className="absolute top-20 left-0 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
            <View className="absolute bottom-40 right-0 w-80 h-80 bg-blue-900 rounded-full blur-3xl" />
          </View>

          {/* Content */}
          <View className="relative z-10 gap-8">
            <View className="gap-3">
              <Text className="text-green-500 text-xs font-bold tracking-widest uppercase">
                Welcome Back
              </Text>
              <Text className="text-4xl font-black text-white leading-tight">
                Login
              </Text>
              <Text className="text-base text-slate-400 leading-6">
                Sign in to access your robot dashboard
              </Text>
            </View>

            <View className="gap-4 mt-2">
              <FormTextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                isFocused={focusedInput === "email"}
                required
              />

              <FormPasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                isFocused={focusedInput === "password"}
                required
              />

              <Pressable
                onPress={onLogin}
                disabled={isLoading}
                className="mt-4 rounded-2xl bg-green-500 items-center justify-center py-4 active:opacity-85"
              >
                <Text className="text-base font-bold text-emerald-950 tracking-wide">
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </Pressable>
            </View>

            <View className="gap-4 mt-2">
              <View className="h-px bg-slate-800" />
              <View className="flex-row gap-2 justify-center items-center">
                <Text className="text-sm font-medium text-slate-400">
                  New here?
                </Text>
                <Link href="/register" asChild>
                  <Pressable onPress={() => Haptics.selectionAsync()}>
                    <Text className="text-sm font-bold text-green-500">
                      Create account
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}
