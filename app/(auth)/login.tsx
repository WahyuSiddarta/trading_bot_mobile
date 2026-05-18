import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import ReCaptcha, {
  GoogleRecaptchaRefAttributes,
} from "@valture/react-native-recaptcha-v3";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { ViewStyle } from "react-native";
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
import { hashPassword } from "@/lib/crypto";
import { useAuthStore } from "@/stores/auth-store";
import { fetchWrapper } from "@/utils/fetcher";

import config from "@/config";

const RECAPTCHA_SITE_KEY = config.RECAPTCHA_KEY;
const RECAPTCHA_BASE_URL = config.BASE_URL;
const RECAPTCHA_LOGIN_ACTION = "login";

const hiddenRecaptchaContainerStyle = {
  position: "absolute",
  width: 0,
  height: 0,
  opacity: 0,
  zIndex: -1,
} satisfies ViewStyle;

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

type LoginPayload = {
  email: string;
  password: string;
  captcha: string;
};

async function loginApi(payload: LoginPayload) {
  return fetchWrapper.postPublic("/api/public/login", payload);
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const errorData = error as {
      message?: unknown;
      error?: unknown;
      code?: unknown;
    };

    if (typeof errorData.message === "string") {
      return errorData.message;
    }

    if (typeof errorData.error === "string") {
      return errorData.error;
    }

    if (typeof errorData.code === "string") {
      return errorData.code;
    }
  }

  return "Please check your credentials and try again.";
}

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
  const toast = useToast();
  const login = useAuthStore((state) => state.login);

  const recaptchaRef = useRef<GoogleRecaptchaRefAttributes>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isPreparingLogin, setIsPreparingLogin] = useState(false);

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
    mutationFn: loginApi,
    onSuccess: async (session) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await login(session);
      router.replace("/");
    },
    onError: (error) => {
      toast.error("Login failed", getLoginErrorMessage(error));
    },
  });
  const isLoginBusy = isPreparingLogin || loginMutation.isPending;

  const onLogin = handleSubmit(async (values) => {
    setIsPreparingLogin(true);

    try {
      const captcha = await recaptchaRef.current?.getToken(
        RECAPTCHA_LOGIN_ACTION,
      );

      if (!captcha) {
        toast.error("Verification failed", "Unable to create reCAPTCHA token.");
        return;
      }

      const passwordHash = await hashPassword(values.password);

      loginMutation.mutate({
        email: values.email,
        password: passwordHash,
        captcha,
      });
    } catch (error) {
      toast.error(
        "Verification failed",
        error instanceof Error ? error.message : "Unable to verify login.",
      );
    } finally {
      setIsPreparingLogin(false);
    }
  });

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
        <View className="justify-center flex-1 px-6 py-8">
          {/* Animated gradient accent */}
          <View className="absolute inset-0 overflow-hidden opacity-20">
            <View className="absolute left-0 bg-green-500 rounded-full top-20 w-72 h-72 blur-3xl" />
            <View className="absolute right-0 bg-blue-900 rounded-full bottom-40 w-80 h-80 blur-3xl" />
          </View>

          {/* Content */}
          <View className="relative z-10 gap-8">
            <ReCaptcha
              ref={recaptchaRef}
              siteKey={RECAPTCHA_SITE_KEY}
              baseUrl={RECAPTCHA_BASE_URL}
              action={RECAPTCHA_LOGIN_ACTION}
              onError={(error) => toast.error("Verification failed", error)}
              containerStyle={hiddenRecaptchaContainerStyle}
              testMode={__DEV__}
            />

            <View className="gap-3">
              <Text className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Welcome Back
              </Text>

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
                    editable={!isLoginBusy}
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
                    editable={!isLoginBusy}
                    required
                  />
                )}
              />

              <Button
                title="Login"
                loadingTitle="Logging in..."
                onPress={onLogin}
                loading={isLoginBusy}
                className="mt-4"
                size="lg"
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
