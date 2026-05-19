import { yupResolver } from "@hookform/resolvers/yup";
import * as Clipboard from "expo-clipboard";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetFormPasswordInput } from "@/components/ui/bottom-sheet-form-password-input";
import { BottomSheetFormTextInput } from "@/components/ui/bottom-sheet-form-text-input";
import { exchanger_master_data } from "@/constant/exchanger";
import { CheckCircle2, ClipboardPaste, X } from "lucide-react-native";
import { RefObject, useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import * as yup from "yup";

export type ApiKeyFormMode = "create" | "edit";

export type ApiKeyFormState = {
  exchangerId: number;
  apiName: string;
  apiKey: string;
  apiSecret: string;
};

type ApiKeyFormSheetProps = {
  sheetRef: RefObject<BottomSheetModal | null>;
  snapPoints: string[];
  mode: ApiKeyFormMode;
  form: ApiKeyFormState;
  onClose: () => void;
  onSubmit: (form: ApiKeyFormState) => void;
};

export const createEmptyApiKeyForm = (): ApiKeyFormState => ({
  exchangerId: exchanger_master_data[0]?.exchanger_id ?? 0,
  apiName: "",
  apiKey: "",
  apiSecret: "",
});

function PasteButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Paste"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      className="items-center justify-center w-9 h-9 rounded-full bg-slate-800/80 active:bg-slate-700"
    >
      <ClipboardPaste size={17} color="#22C986" strokeWidth={2.4} />
    </Pressable>
  );
}

const createApiKeySchema = yup.object({
  exchangerId: yup
    .number()
    .moreThan(0, "Exchange is required")
    .required("Exchange is required"),
  apiName: yup.string().trim().required("API name is required"),
  apiKey: yup.string().trim().required("API key is required"),
  apiSecret: yup.string().trim().required("API secret is required"),
});

const editApiKeySchema = createApiKeySchema.shape({
  apiSecret: yup.string().trim().optional().default(""),
});

export function ApiKeyFormSheet({
  sheetRef,
  snapPoints,
  mode,
  form,
  onClose,
  onSubmit,
}: ApiKeyFormSheetProps) {
  const isCreateMode = mode === "create";
  const formSchema = useMemo(
    () => (isCreateMode ? createApiKeySchema : editApiKeySchema),
    [isCreateMode],
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ApiKeyFormState>({
    defaultValues: form,
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });
  const selectedExchangerId = watch("exchangerId");

  useEffect(() => {
    reset(form);
  }, [form, reset]);

  const submitForm = handleSubmit((values) => {
    onSubmit(values);
  });

  const pasteField = async (fieldName: "apiKey" | "apiSecret") => {
    const clipboardValue = await Clipboard.getStringAsync();

    setValue(fieldName, clipboardValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.58}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: "#07111F" }}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#64748B" }}
      index={0}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      ref={sheetRef}
      snapPoints={snapPoints}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <BottomSheetScrollView
          contentContainerClassName="gap-4 px-5 pb-8 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-white">
                {isCreateMode ? "Create API Key" : "Edit API Key"}
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                {isCreateMode
                  ? "Add exchange credentials for bot access"
                  : "API secret is blank and only sent when entered"}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="items-center justify-center rounded-full h-9 w-9 bg-secondary active:opacity-80"
            >
              <X size={18} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
          </View>

          <View className="gap-2">
            <Text className="text-xs font-bold uppercase text-muted-foreground">
              Exchange
            </Text>
            <View className="flex-row gap-2">
              {exchanger_master_data.map((exchanger) => {
                const isSelected =
                  selectedExchangerId === exchanger.exchanger_id;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={exchanger.exchanger_id}
                    onPress={() =>
                      setValue("exchangerId", exchanger.exchanger_id, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 rounded-2xl border p-3 active:opacity-85 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="items-center justify-center w-8 h-8 rounded-lg bg-surface">
                        <Image
                          source={exchanger.logo_url}
                          style={{ width: 22, height: 22 }}
                          resizeMode="contain"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-extrabold text-foreground">
                          {exchanger.name}
                        </Text>
                        <Text className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                          Select
                        </Text>
                      </View>
                      {isSelected ? (
                        <CheckCircle2
                          size={16}
                          color="#22C986"
                          strokeWidth={2.6}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {errors.exchangerId?.message ? (
              <Text className="text-xs font-medium text-red-400">
                {errors.exchangerId.message}
              </Text>
            ) : null}
          </View>

          <Controller
            control={control}
            name="apiName"
            render={({ field: { onBlur, onChange: onFieldChange, value } }) => (
              <BottomSheetFormTextInput
                autoCapitalize="characters"
                error={errors.apiName?.message}
                isValid={Boolean(value) && !errors.apiName}
                label="API Name"
                onBlur={onBlur}
                onChange={onFieldChange}
                placeholder="BINANCE"
                required
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="apiKey"
            render={({ field: { onBlur, onChange: onFieldChange, value } }) => (
              <BottomSheetFormTextInput
                append={<PasteButton onPress={() => pasteField("apiKey")} />}
                autoCapitalize="none"
                error={errors.apiKey?.message}
                isValid={Boolean(value) && !errors.apiKey}
                label="API Key"
                onBlur={onBlur}
                onChange={onFieldChange}
                placeholder="Exchange API key"
                required
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="apiSecret"
            render={({ field: { onBlur, onChange: onFieldChange, value } }) => (
              <BottomSheetFormPasswordInput
                append={<PasteButton onPress={() => pasteField("apiSecret")} />}
                error={errors.apiSecret?.message}
                isValid={Boolean(value) && !errors.apiSecret}
                label="API Secret"
                onBlur={onBlur}
                onChange={onFieldChange}
                placeholder={
                  isCreateMode ? "Exchange API secret" : "Leave blank to keep"
                }
                required={isCreateMode}
                value={value}
              />
            )}
          />

          <View className="flex-row gap-3 pt-1">
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="flex-1 items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 active:opacity-85"
            >
              <Text className="text-sm font-extrabold text-foreground">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!isValid}
              onPress={submitForm}
              className="flex-1 items-center justify-center rounded-2xl bg-primary px-4 py-3 active:opacity-85 disabled:opacity-50"
            >
              <Text className="text-sm font-extrabold text-primary-foreground">
                {isCreateMode ? "Create" : "Save"}
              </Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
}
