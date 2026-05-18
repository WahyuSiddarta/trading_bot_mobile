import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { CheckCircle2, Copy, KeyRound, Server } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useToast } from "@/components/ui/toast";
import { useApiKeysQuery } from "@/hooks/use-query";
import type { ApiKeyItem, ApiServerItem } from "@/mockresponse/api-key";

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

  const copyText = async (label: string, value: string) => {
    await Clipboard.setStringAsync(value);
    toast.success(`${label} copied`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerClassName="gap-5 px-5 pb-28 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5 border rounded-3xl border-border bg-surface">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-[#123047]">
            <KeyRound size={24} color="#22C986" strokeWidth={2.5} />
          </View>
          <Text className="text-2xl font-bold text-foreground">API Keys</Text>
          <Text className="mt-2 text-sm leading-6 text-muted-foreground">
            Manage exchange API access and copy the server IPs for whitelist
            setup.
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Server size={18} color="#22C986" strokeWidth={2.5} />
            <Text className="text-lg font-bold text-foreground">
              Server IP Address
            </Text>
          </View>

          {isLoading ? (
            <View className="p-4 border rounded-2xl border-border bg-surface">
              <Text className="text-sm font-semibold text-muted-foreground">
                Loading server IPs...
              </Text>
            </View>
          ) : (
            Object.entries(serverGroups).map(([exchangerId, ipAddresses]) => {
              const joinedIpAddresses = ipAddresses.join(", ");

              return (
                <View
                  key={exchangerId}
                  className="p-4 border rounded-2xl border-border bg-surface"
                >
                  <View className="flex-row items-center justify-between gap-3 mb-3">
                    <View>
                      <Text className="text-xs font-semibold uppercase text-muted-foreground">
                        Exchanger ID
                      </Text>
                      <Text className="mt-1 text-base font-bold text-foreground">
                        {exchangerId}
                      </Text>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        copyText("Server IP address", joinedIpAddresses)
                      }
                      className="h-10 w-10 items-center justify-center rounded-full border border-border bg-[#123047]"
                    >
                      <Copy size={17} color="#22C986" strokeWidth={2.5} />
                    </Pressable>
                  </View>

                  <Text className="px-3 py-3 font-mono text-sm leading-5 rounded-xl bg-background text-foreground">
                    {joinedIpAddresses}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <CheckCircle2 size={18} color="#22C986" strokeWidth={2.5} />
            <Text className="text-lg font-bold text-foreground">
              Exchange Access
            </Text>
          </View>

          {isLoading ? (
            <View className="p-4 border rounded-2xl border-border bg-surface">
              <Text className="text-sm font-semibold text-muted-foreground">
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
  return (
    <View className="p-4 border rounded-2xl border-border bg-surface">
      <View className="flex-row items-start justify-between gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase text-muted-foreground">
            API Name
          </Text>
          <Text className="mt-1 text-lg font-bold text-foreground">
            {item.api_name}
          </Text>
        </View>

        <Switch
          trackColor={{ false: "#233041", true: "#22C986" }}
          thumbColor={enabled ? "#07111f" : "#d4d8dd"}
          value={enabled}
          onValueChange={onToggle}
        />
      </View>

      <View className="flex-row items-center gap-3 p-3 rounded-xl bg-background">
        <Text
          className="flex-1 font-mono text-xs leading-5 text-foreground"
          numberOfLines={2}
        >
          {item.api_key}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={onCopyApiKey}
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-[#123047]"
        >
          <Copy size={16} color="#22C986" strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
