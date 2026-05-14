import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { FormPasswordInput } from "@/components/ui/form-password-input";
import { FormTextInput } from "@/components/ui/form-text-input";
import { useAuthStore } from "@/stores/auth-store";

const registerSchema = yup.object({
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

type RegisterFormValues = yup.InferType<typeof registerSchema>;

function isRegisterFieldValid(
  field: keyof RegisterFormValues,
  values: RegisterFormValues,
) {
  try {
    registerSchema.validateSyncAt(field, values);
    return true;
  } catch {
    return false;
  }
}

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields, errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: yupResolver(registerSchema),
  });
  const formValues = watch();

  const registerMutation = useMutation({
    mutationFn: async (_values: RegisterFormValues) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      register();
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const onRegister = handleSubmit((values) => {
    registerMutation.mutate(values);
  });

  return (
    <LinearGradient
      colors={["#02050c", "#071b17", "#020817"]}
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
          <View className="absolute inset-0 overflow-hidden">
            <View className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500 opacity-20 blur-3xl" />
            <View className="absolute top-1/3 -left-28 h-72 w-72 rounded-full bg-cyan-700 opacity-20 blur-3xl" />
            <View className="absolute -bottom-24 right-8 h-96 w-96 rounded-full bg-lime-700 opacity-10 blur-3xl" />
            <View className="absolute left-6 right-6 top-24 h-px bg-emerald-400 opacity-20" />
            <View className="absolute bottom-28 left-12 right-16 h-px bg-cyan-300 opacity-10" />
          </View>

          <View className="relative z-10 gap-8">
            <View className="gap-3">
              <Text className="text-green-500 text-xs font-bold tracking-widest uppercase">
                Create Account
              </Text>
              <Text className="text-4xl font-black text-white leading-tight">
                Register
              </Text>
              <Text className="text-sm text-slate-400 leading-6">
                Create your account to access your robot dashboard
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
                        isRegisterFieldValid("email", formValues),
                    )}
                    editable={!registerMutation.isPending}
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
                    placeholder="Create your password"
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
                        isRegisterFieldValid("password", formValues),
                    )}
                    editable={!registerMutation.isPending}
                    required
                  />
                )}
              />

              <Button
                title="Register"
                loadingTitle="Creating account..."
                onPress={onRegister}
                loading={registerMutation.isPending}
                className="mt-4"
                size="lg"
              />
            </View>

            <View className="gap-4 mt-2">
              <View className="h-px bg-slate-800" />
              <View className="flex-row gap-2 justify-center items-center">
                <Text className="text-sm font-medium text-slate-400">
                  Already have an account?
                </Text>
                <Link href="/login" asChild>
                  <Pressable onPress={() => Haptics.selectionAsync()}>
                    <Text className="text-sm font-bold text-green-500">
                      Login
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
