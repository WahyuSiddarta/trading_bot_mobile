import type { ApiKeyItem } from "@/api/api-keys";
import { getExchanger } from "@/utils/ui";
import { Copy, Pencil, Trash2 } from "lucide-react-native";
import { Image, Pressable, Switch, Text, View } from "react-native";

type ApiKeyCardProps = {
  item: ApiKeyItem;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onCopyApiKey: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ApiKeyCard({
  item,
  enabled,
  onToggle,
  onCopyApiKey,
  onEdit,
  onDelete,
}: ApiKeyCardProps) {
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

      <View className="flex-row gap-2 mt-3">
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 active:opacity-85"
        >
          <Pencil size={14} color="#22C986" strokeWidth={2.5} />
          <Text className="text-xs font-extrabold text-foreground">Edit</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onDelete}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 active:opacity-85"
        >
          <Trash2 size={14} color="#F87171" strokeWidth={2.5} />
          <Text className="text-xs font-extrabold text-destructive-foreground">
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
