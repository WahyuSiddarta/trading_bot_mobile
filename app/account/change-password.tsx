import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, KeySquare, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

import { FormPasswordInput } from "@/components/ui/form-password-input";
import { Button } from "@/components/ui/my-button";
import { useToast } from "@/components/ui/toast";
import { hashPassword } from "@/lib/crypto";
import { errorMessages } from "@/utils/error";

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from current password",
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Password confirmation does not match"),
});

type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

async function changePasswordApi(payload: ChangePasswordPayload) {
  console.log("Change password API called with payload:", payload);
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    code: "PASSWORD_CHANGED",
    status: "OK",
  };
  // return fetchWrapper.postPrivate("/api/change-password", payload);
}

function isChangePasswordFieldValid(
  field: keyof ChangePasswordFormValues,
  values: ChangePasswordFormValues,
) {
  try {
    changePasswordSchema.validateSyncAt(field, values);
    return true;
  } catch {
    return false;
  }
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isPreparingSubmit, setIsPreparingSubmit] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { dirtyFields, errors, isValid },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: yupResolver(changePasswordSchema),
  });
  const formValues = watch();

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      toast.success("Password updated", "Use the new password next login.");
      router.back();
    },
    onError: (error) => {
      toast.error("Password update failed", errorMessages(error));
    },
  });

  const isSubmitBusy = isPreparingSubmit || changePasswordMutation.isPending;
  const canSubmit = isValid && !isSubmitBusy;

  const onSubmit = handleSubmit(async (values) => {
    setIsPreparingSubmit(true);

    try {
      const currentPasswordHash = await hashPassword(values.currentPassword);
      const newPasswordHash = await hashPassword(values.newPassword);

      changePasswordMutation.mutate({
        current_password: currentPasswordHash,
        password: newPasswordHash,
        password_confirmation: newPasswordHash,
      });
    } catch (error) {
      toast.error("Password update failed", errorMessages(error));
    } finally {
      setIsPreparingSubmit(false);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-[#07111F]" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocusedInput(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 bg-background"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 36 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 pt-4 pb-4 border-b border-border/70 bg-background">
              <View className="flex-row items-center gap-3">
                <Pressable
                  className="items-center justify-center w-10 h-10 border rounded-md border-border bg-card active:opacity-70"
                  onPress={() => router.back()}
                >
                  <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
                </Pressable>
                <View className="flex-1">
                  <Text className="text-lg font-black text-white">
                    Change Password
                  </Text>
                  <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
                    Update your account login credential
                  </Text>
                </View>
                <View className="items-center justify-center w-10 h-10 border rounded-md border-primary/30 bg-primary/10">
                  <KeySquare size={20} color="#22C986" strokeWidth={2.4} />
                </View>
              </View>
            </View>

            <View className="gap-4 px-5 pt-5">
              <View className="gap-3 p-4 border rounded-2xl border-border bg-card">
                <View className="flex-row items-start gap-3">
                  <View className="items-center justify-center w-10 h-10 border rounded-md border-primary/30 bg-primary/10">
                    <ShieldCheck size={20} color="#22C986" strokeWidth={2.4} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-white">
                      Secure password update
                    </Text>
                    <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                      Enter your current password, then confirm the new password
                      before saving.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="gap-4 p-4 border rounded-2xl border-border bg-card">
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <FormPasswordInput
                      label="Current Password"
                      placeholder="Enter current password"
                      value={value}
                      onChange={onChange}
                      onFocus={() => setFocusedInput("currentPassword")}
                      onBlur={() => {
                        onBlur();
                        setFocusedInput(null);
                      }}
                      isFocused={focusedInput === "currentPassword"}
                      error={errors.currentPassword?.message}
                      isValid={Boolean(
                        dirtyFields.currentPassword &&
                        isChangePasswordFieldValid(
                          "currentPassword",
                          formValues,
                        ),
                      )}
                      editable={!isSubmitBusy}
                      required
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <FormPasswordInput
                      label="New Password"
                      placeholder="Enter new password"
                      value={value}
                      onChange={onChange}
                      onFocus={() => setFocusedInput("newPassword")}
                      onBlur={() => {
                        onBlur();
                        setFocusedInput(null);
                      }}
                      isFocused={focusedInput === "newPassword"}
                      error={errors.newPassword?.message}
                      isValid={Boolean(
                        dirtyFields.newPassword &&
                        isChangePasswordFieldValid("newPassword", formValues),
                      )}
                      editable={!isSubmitBusy}
                      required
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <FormPasswordInput
                      label="Confirmation Password"
                      placeholder="Confirm new password"
                      value={value}
                      onChange={onChange}
                      onFocus={() => setFocusedInput("confirmPassword")}
                      onBlur={() => {
                        onBlur();
                        setFocusedInput(null);
                      }}
                      isFocused={focusedInput === "confirmPassword"}
                      error={errors.confirmPassword?.message}
                      isValid={Boolean(
                        dirtyFields.confirmPassword &&
                        isChangePasswordFieldValid(
                          "confirmPassword",
                          formValues,
                        ),
                      )}
                      editable={!isSubmitBusy}
                      required
                    />
                  )}
                />

                <Button
                  title="Save Password"
                  loadingTitle="Saving..."
                  onPress={onSubmit}
                  loading={isSubmitBusy}
                  disabled={!canSubmit}
                  className="mt-2"
                  size="lg"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
