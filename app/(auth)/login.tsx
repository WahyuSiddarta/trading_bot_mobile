import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
              <Text className="text-sm text-slate-400 leading-6">
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
                  toast.warning(
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

              <BottomSheetModal
                ref={bottomSheetModalRef}
                onChange={handleSheetChanges}
              >
                <BottomSheetView style={{ flex: 1, alignItems: "center" }}>
                  <Text>Awesome 🎉</Text>
                </BottomSheetView>
              </BottomSheetModal>
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
