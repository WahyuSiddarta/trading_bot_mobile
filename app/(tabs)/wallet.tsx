import { Wallet } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4">
      <View className="rounded-3xl border border-border bg-surface p-5">
        <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-[#123047]">
          <Wallet size={24} color="#22C986" strokeWidth={2.5} />
        </View>
        <Text className="text-2xl font-bold text-foreground">Wallet</Text>
        <Text className="mt-2 text-sm leading-6 text-muted-foreground">
          Mock screen for balances, allocation, deposits, and withdrawal status.
        </Text>
      </View>
    </SafeAreaView>
  );
}
