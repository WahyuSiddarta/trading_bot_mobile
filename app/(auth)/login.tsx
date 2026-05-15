import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as yup from "yup";

import { FormPasswordInput } from "@/components/ui/form-password-input";
import { FormTextInput } from "@/components/ui/form-text-input";
import { Button } from "@/components/ui/my-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth-store";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

function isLoginFieldValid(
  field: keyof LoginFormValues,
  values: LoginFormValues,
) {
  try {
    loginSchema.validateSyncAt(field, values);
    return true;
  } catch {
    return false;
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const toast = useToast();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields, errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });
  const formValues = watch();

  const loginMutation = useMutation({
    mutationFn: async (_values: LoginFormValues) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      login();
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const onLogin = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetSnapPoints = useMemo(() => ["45%", "90%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <LinearGradient
      colors={["#01040a", "#0a1620", "#01040a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={bottomSheetSnapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#0f172a" }}
        handleIndicatorStyle={{ backgroundColor: "#64748b" }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          <View className="gap-3">
            <Text className="text-xs font-bold tracking-widest text-green-500 uppercase">
              Gorhom Demo
            </Text>
            <Text className="text-2xl font-black text-white">
              Bottom sheet is fully open
            </Text>
            <Text className="text-sm leading-6 text-slate-300">
              This demo uses explicit snap points, starts at the larger snap
              point, and disables dynamic sizing so the sheet can expand to the
              intended height.
            </Text>
          </View>

          <View className="gap-3 mt-8">
            <View className="p-4 border rounded-xl border-slate-700 bg-slate-900/70">
              <Text className="text-sm font-bold text-white">Snap points</Text>
              <Text className="mt-1 text-sm text-slate-400">45% and 90%</Text>
            </View>
            <View className="p-4 border rounded-xl border-slate-700 bg-slate-900/70">
              <Text className="text-sm font-bold text-white">
                Initial index
              </Text>
              <Text className="mt-1 text-sm text-slate-400">
                Opens directly to index 1
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocusedInput(null);
        }}
      >
        <View className="justify-center flex-1 px-6 py-8">
          {/* Animated gradient accent */}
          <View className="absolute inset-0 overflow-hidden opacity-20">
            <View className="absolute left-0 bg-green-500 rounded-full top-20 w-72 h-72 blur-3xl" />
            <View className="absolute right-0 bg-blue-900 rounded-full bottom-40 w-80 h-80 blur-3xl" />
          </View>

          {/* Content */}
          <View className="relative z-10 gap-8">
            <View className="gap-3">
              <Text className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Welcome Back
              </Text>
              <Skeleton className="w-full h-12" />
              <Text className="text-4xl font-black leading-tight text-white">
                Login
              </Text>
              <Text className="text-sm leading-6 text-slate-400">
                Sign in to access your robot dashboard
              </Text>
            </View>

            <View className="gap-4 mt-2">
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <FormTextInput
                    label="Email"
                    placeholder="Enter your email"
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => {
                      onBlur();
                      setFocusedInput(null);
                    }}
                    isFocused={focusedInput === "email"}
                    error={errors.email?.message}
                    isValid={Boolean(
                      dirtyFields.email &&
                      isLoginFieldValid("email", formValues),
                    )}
                    editable={!loginMutation.isPending}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => (
                  <FormPasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => {
                      onBlur();
                      setFocusedInput(null);
                    }}
                    isFocused={focusedInput === "password"}
                    error={errors.password?.message}
                    isValid={Boolean(
                      dirtyFields.password &&
                      isLoginFieldValid("password", formValues),
                    )}
                    editable={!loginMutation.isPending}
                    required
                  />
                )}
              />

              <Button
                title="Login"
                loadingTitle="Logging in..."
                onPress={onLogin}
                loading={loginMutation.isPending}
                className="mt-4"
                size="lg"
              />

              <Button
                title="Show toast demo"
                variant="secondary"
                onPress={() =>
                  toast.success(
                    "Toast is ready",
                    "This message can be triggered from any screen.",
                  )
                }
              />
              <Button
                title="Show gorhum demo"
                variant="secondary"
                onPress={handlePresentModalPress}
              />
            </View>

            <View className="gap-4 mt-2">
              <View className="h-px bg-slate-800" />
              <View className="flex-row items-center justify-center gap-2">
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
