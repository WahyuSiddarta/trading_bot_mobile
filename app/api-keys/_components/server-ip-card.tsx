import { getExchanger } from "@/utils/ui";
import { Copy } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

type ServerIpCardProps = {
  exchangerId: number;
  ipAddresses: string[];
  onCopy: (value: string) => void;
};

export function ServerIpCard({
  exchangerId,
  ipAddresses,
  onCopy,
}: ServerIpCardProps) {
  const joinedIpAddresses = ipAddresses.join(",");
  const exchanger = getExchanger(exchangerId);

  return (
    <View className="p-3 border rounded-xl border-border bg-surface">
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
          onPress={() => onCopy(joinedIpAddresses)}
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
}
