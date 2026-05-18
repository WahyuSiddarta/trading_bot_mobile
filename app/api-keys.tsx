import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  Copy,
  KeyRound,
  Server,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ApiKeyItem, ApiServerItem } from "@/api/api-keys";
import { useToast } from "@/components/ui/toast";
import { useApiKeysQuery } from "@/hooks/use-query";
import { getExchanger } from "@/utils/ui";

function groupServerIps(server: ApiServerItem[]) {
  return server.reduce<Record<number, string[]>>((groups, item) => {
    groups[item.exchanger_id] = groups[item.exchanger_id] ?? [];
    groups[item.exchanger_id].push(item.ip_addr);
    return groups;
  }, {});
}

export default function ApiKeysScreen() {
  const toast = useToast();
  const { data: apiResponse, isLoading } = useApiKeysQuery();
  const [enabledByKey, setEnabledByKey] = useState<Record<string, boolean>>({});

  const serverGroups = useMemo(
    () => groupServerIps(apiResponse?.server ?? []),
    [apiResponse?.server],
  );

  const apiKeys = apiResponse?.data ?? [];
  const connectedCount = apiKeys.filter((item) =>
    enabledByKey[item.api_key] === undefined
      ? item.enabled
      : enabledByKey[item.api_key],
  ).length;

  const copyText = async (label: string, value: string) => {
    await Clipboard.setStringAsync(value);
    toast.success(`${label} copied`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-24 pt-3"
        showsVerticalScrollIndicator={false}
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
          ) : (
            Object.entries(serverGroups).map(([exchangerId, ipAddresses]) => {
              const joinedIpAddresses = ipAddresses.join(",");
              const exchanger = getExchanger(Number(exchangerId));

              return (
                <View
                  key={exchangerId}
                  className="p-3 border rounded-xl border-border bg-surface"
                >
                  <View className="mb-2.5 flex-row items-center justify-between gap-3">
                    <View className="flex flex-row items-center gap-3">
                      {exchanger?.logo_url ? (
                        <View className="items-center justify-center w-5 h-5">
                          <Image
                            source={exchanger.logo_url}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                          />
                        </View>
                      ) : null}
                      <Text className="mt-0.5 text-sm font-bold text-foreground">
                        {exchanger?.name || `Exchanger ${exchangerId}`}
                      </Text>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        copyText("Server IP address", joinedIpAddresses)
                      }
                      className="h-8 w-8 items-center justify-center rounded-full border border-border bg-[#123047]"
                    >
                      <Copy size={14} color="#22C986" strokeWidth={2.5} />
                    </Pressable>
                  </View>

                  <Text className="rounded-lg bg-background px-2.5 py-2 font-mono text-xs leading-4 text-foreground">
                    {joinedIpAddresses}
                  </Text>
                </View>
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
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ApiKeyCard({
  item,
  enabled,
  onToggle,
  onCopyApiKey,
}: {
  item: ApiKeyItem;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onCopyApiKey: () => void;
}) {
  const exchanger = getExchanger(item.exchanger_id);

  return (
    <View className="p-3 border rounded-xl border-border bg-surface">
      <View className="flex-row items-start justify-between gap-3 mb-3">
        <View className="flex-row items-center flex-1 gap-3">
          {exchanger?.logo_url ? (
            <View className="items-center justify-center w-8 h-8 rounded-lg bg-background">
              <Image
                source={exchanger.logo_url}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </View>
          ) : null}

          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">
              {exchanger?.name || item.api_name}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              {item.api_name} API Access
            </Text>
          </View>
        </View>

        <View className="items-end gap-1.5">
          <View
            className={`rounded-full border px-2.5 py-1 ${
              enabled
                ? "border-emerald-500/30 bg-emerald-950/70"
                : "border-border bg-background"
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                enabled ? "text-emerald-300" : "text-muted-foreground"
              }`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </Text>
          </View>

          <Switch
            ios_backgroundColor="#1f2b3a"
            trackColor={{ false: "#1f2b3a", true: "#34D399" }}
            thumbColor={enabled ? "#ECFDF5" : "#7D93A5"}
            value={enabled}
            onValueChange={onToggle}
          />
        </View>
      </View>

      <View className="rounded-lg bg-background p-2.5">
        <View className="mb-1.5 flex-row items-center justify-between">
          <Text className="text-[10px] font-semibold uppercase text-muted-foreground">
            API Key
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onCopyApiKey}
            className="h-7 w-7 items-center justify-center rounded-full border border-border bg-[#123047]"
          >
            <Copy size={13} color="#22C986" strokeWidth={2.5} />
          </Pressable>
        </View>

        <Text
          className="font-mono text-[11px] leading-4 text-foreground"
          numberOfLines={2}
        >
          {item.api_key}
        </Text>
      </View>
    </View>
  );
}
