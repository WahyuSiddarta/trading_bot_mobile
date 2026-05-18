import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  KeyRound,
  Plus,
  Server,
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ApiKeyItem, ApiServerItem } from "@/api/api-keys";
import { useToast } from "@/components/ui/toast";
import { useApiKeysQuery } from "@/hooks/use-query";
import { ApiKeyCard } from "./api-keys/_components/api-key-card";
import {
  ApiKeyFormSheet,
  createEmptyApiKeyForm,
  type ApiKeyFormMode,
  type ApiKeyFormState,
} from "./api-keys/_components/api-key-form-sheet";
import { ServerIpCard } from "./api-keys/_components/server-ip-card";

function groupServerIps(server: ApiServerItem[]) {
  return server.reduce<Record<number, string[]>>((groups, item) => {
    groups[item.exchanger_id] = groups[item.exchanger_id] ?? [];
    groups[item.exchanger_id].push(item.ip_addr);
    return groups;
  }, {});
}

type ApiKeySubmitPayload = {
  exchanger_id: number;
  api_name: string;
  api_key: string;
  api_secret?: string;
};

export default function ApiKeysScreen() {
  const toast = useToast();
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useApiKeysQuery();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetSnapPoints = useMemo(() => ["82%"], []);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [enabledByKey, setEnabledByKey] = useState<Record<string, boolean>>({});
  const [formMode, setFormMode] = useState<ApiKeyFormMode>("create");
  const [editingItem, setEditingItem] = useState<ApiKeyItem | null>(null);
  const [form, setForm] = useState<ApiKeyFormState>(createEmptyApiKeyForm);
  // TODO: replace with real API call; toggle to true to simulate a failure
  const simulateError = true;

  useEffect(() => {
    setApiKeys(apiResponse?.data ?? []);
  }, [apiResponse?.data]);

  const serverGroups = useMemo(
    () => groupServerIps(apiResponse?.server ?? []),
    [apiResponse?.server],
  );

  const connectedCount = apiKeys.filter((item) =>
    enabledByKey[item.api_key] === undefined
      ? item.enabled
      : enabledByKey[item.api_key],
  ).length;

  const copyText = async (label: string, value: string) => {
    await Clipboard.setStringAsync(value);
    toast.success(`${label} copied`);
  };

  const openCreateSheet = () => {
    setFormMode("create");
    setEditingItem(null);
    setForm(createEmptyApiKeyForm());
    bottomSheetModalRef.current?.present();
  };

  const openEditSheet = (item: ApiKeyItem) => {
    setFormMode("edit");
    setEditingItem(item);
    setForm({
      exchangerId: item.exchanger_id,
      apiName: item.api_name,
      apiKey: item.api_key,
      apiSecret: "",
    });
    bottomSheetModalRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleSubmit = (values: ApiKeyFormState) => {
    const payload: ApiKeySubmitPayload = {
      exchanger_id: values.exchangerId,
      api_name: values.apiName.trim(),
      api_key: values.apiKey.trim(),
    };
    const trimmedSecret = values.apiSecret.trim();

    if (trimmedSecret) {
      payload.api_secret = trimmedSecret;
    }

    if (simulateError) {
      toast.error(
        formMode === "create"
          ? "Failed to create API key"
          : "Failed to update API key",
        "Please try again.",
      );
      return;
    }

    if (formMode === "create") {
      setApiKeys((current) => [
        ...current,
        {
          exchanger_id: payload.exchanger_id,
          user_id: "",
          api_key: payload.api_key,
          api_name: payload.api_name,
          enabled: true,
        },
      ]);
      toast.success("API key created");
    } else if (editingItem) {
      setApiKeys((current) =>
        current.map((item) =>
          item === editingItem
            ? {
                ...item,
                exchanger_id: payload.exchanger_id,
                api_name: payload.api_name,
                api_key: payload.api_key,
              }
            : item,
        ),
      );
      toast.success("API key updated");
    }

    closeSheet();
  };

  const handleDelete = (itemToDelete: ApiKeyItem) => {
    if (simulateError) {
      toast.error("Failed to delete API key", "Please try again.");
      return;
    }

    setApiKeys((current) => current.filter((item) => item !== itemToDelete));
    setEnabledByKey((current) => {
      const next = { ...current };
      delete next[itemToDelete.api_key];
      return next;
    });
    toast.success("API key deleted");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-24 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              className="items-center justify-center border rounded-full h-9 w-9 border-border bg-surface"
            >
              <ChevronLeft size={19} color="#E5FFF0" strokeWidth={2.6} />
            </Pressable>

            <View className="rounded-full border border-emerald-500/30 bg-emerald-950/70 px-2.5 py-1">
              <Text className="text-[11px] font-bold text-emerald-300">
                {connectedCount} Connected
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#123047]">
              <KeyRound size={20} color="#22C986" strokeWidth={2.5} />
            </View>

            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">
                API Keys
              </Text>
              <Text className="text-xs leading-5 text-muted-foreground">
                Exchange credentials and whitelist IPs for bot access.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={openCreateSheet}
              className="flex-row items-center gap-1.5 rounded-full bg-primary px-3 py-2 active:opacity-85"
            >
              <Plus size={15} color="#020617" strokeWidth={2.6} />
              <Text className="text-xs font-extrabold text-primary-foreground">
                Add
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-2.5">
          <View className="flex-row items-center gap-2">
            <Server size={16} color="#22C986" strokeWidth={2.5} />
            <Text className="text-base font-bold text-foreground">
              Server IP Address
            </Text>
          </View>

          {isLoading ? (
            <View className="p-3 border rounded-xl border-border bg-surface">
              <Text className="text-xs font-semibold text-muted-foreground">
                Loading server IPs...
              </Text>
            </View>
          ) : isError ? (
            <View className="p-3 border rounded-xl border-red-500/30 bg-red-950/40">
              <Text className="text-xs font-semibold text-red-400">
                Failed to load server IPs.
              </Text>
            </View>
          ) : (
            Object.entries(serverGroups).map(([exchangerId, ipAddresses]) => {
              return (
                <ServerIpCard
                  key={exchangerId}
                  exchangerId={Number(exchangerId)}
                  ipAddresses={ipAddresses}
                  onCopy={(value) => copyText("Server IP address", value)}
                />
              );
            })
          )}
        </View>

        <View className="gap-2.5">
          <View className="flex-row items-center gap-2">
            <CheckCircle2 size={16} color="#22C986" strokeWidth={2.5} />
            <Text className="text-base font-bold text-foreground">
              Exchange Access
            </Text>
          </View>

          {isLoading ? (
            <View className="p-3 border rounded-xl border-border bg-surface">
              <Text className="text-xs font-semibold text-muted-foreground">
                Loading API keys...
              </Text>
            </View>
          ) : isError ? (
            <View className="p-3 border rounded-xl border-red-500/30 bg-red-950/40">
              <Text className="text-xs font-semibold text-red-400">
                Failed to load API keys.
              </Text>
            </View>
          ) : (
            apiKeys.map((item) => (
              <ApiKeyCard
                key={`${item.exchanger_id}-${item.api_name}`}
                item={item}
                enabled={
                  enabledByKey[item.api_key] === undefined
                    ? item.enabled
                    : enabledByKey[item.api_key]
                }
                onToggle={(enabled) =>
                  setEnabledByKey((current) => ({
                    ...current,
                    [item.api_key]: enabled,
                  }))
                }
                onCopyApiKey={() => copyText("API key", item.api_key)}
                onDelete={() => handleDelete(item)}
                onEdit={() => openEditSheet(item)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <ApiKeyFormSheet
        form={form}
        mode={formMode}
        onClose={closeSheet}
        onSubmit={handleSubmit}
        sheetRef={bottomSheetModalRef}
        snapPoints={bottomSheetSnapPoints}
      />
    </SafeAreaView>
  );
}
