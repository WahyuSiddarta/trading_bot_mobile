import * as Clipboard from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleX,
  Copy,
  Network,
  RefreshCw,
  UsersRound,
} from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useToast } from "@/components/ui/toast";
import {
  type AuxiliaryValue,
  type ReferralNode,
  useReferralQuery,
} from "@/hooks/use-query";
import { useAuthStore } from "@/stores/auth-store";
import { errorMessages } from "@/utils/error";

type ReferralMeta = {
  activated: boolean;
};

type AuxiliaryEntry = {
  key: string;
  value: AuxiliaryValue;
};

function getAuxiliaryMap(auxiliary: ReferralNode["auxiliary"]) {
  return auxiliary.reduce<Record<string, AuxiliaryValue>>(
    (result, item) => ({ ...result, ...item }),
    {},
  );
}

function getAuxiliaryEntries(auxiliary: ReferralNode["auxiliary"]) {
  return Object.entries(getAuxiliaryMap(auxiliary)).map(([key, value]) => ({
    key,
    value,
  }));
}

function parseAuxiliary(auxiliary: ReferralNode["auxiliary"]): ReferralMeta {
  const mergedAuxiliary = getAuxiliaryMap(auxiliary);

  return {
    activated: Boolean(mergedAuxiliary.activated),
  };
}

function formatAuxiliaryLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isNumericLike(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

function formatNumberValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 5,
  }).format(value);
}

function formatAuxiliaryValue(value: AuxiliaryValue) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return formatNumberValue(value);
  }

  if (isNumericLike(value)) {
    return formatNumberValue(Number(value));
  }

  return value;
}

function StatTile({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "amber";
}) {
  const tileClassName = {
    amber: "border-[#F59E0B]/30 bg-[#F59E0B]/10",
    primary: "border-primary/30 bg-primary/10",
  }[tone];
  const labelClassName = {
    amber: "text-[#F59E0B]",
    primary: "text-primary",
  }[tone];

  return (
    <View className={`flex-1 rounded-lg border px-3 py-3 ${tileClassName}`}>
      <Text className="text-xl font-black text-white">{value}</Text>
      <Text className={`mt-1 text-xs font-semibold ${labelClassName}`}>
        {label}
      </Text>
    </View>
  );
}

function ReferralNodeCard({ node }: { node: ReferralNode }) {
  const meta = parseAuxiliary(node.auxiliary);
  const auxiliaryEntries = getAuxiliaryEntries(node.auxiliary);
  const isActive = meta.activated;

  return (
    <View
      className={`rounded-2xl border px-4 py-3 ${
        isActive
          ? "border-primary/25 bg-card"
          : "border-[#F59E0B]/25 bg-[#251B0A]"
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl border ${
            isActive
              ? "border-primary/35 bg-primary/15"
              : "border-[#F59E0B]/35 bg-[#F59E0B]/10"
          }`}
        >
          <UsersRound
            size={21}
            color={isActive ? "#22C986" : "#F59E0B"}
            strokeWidth={2.4}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold text-white">{node.label}</Text>
            {isActive ? (
              <CheckCircle2 size={15} color="#22C986" strokeWidth={2.6} />
            ) : (
              <CircleX size={15} color="#F59E0B" strokeWidth={2.6} />
            )}
          </View>
          <Text
            className={`mt-0.5 text-xs font-semibold ${
              isActive ? "text-primary" : "text-[#F59E0B]"
            }`}
          >
            {isActive ? "Active referral" : "Not active yet"}
          </Text>
        </View>

        <View
          className={`rounded-md border px-2 py-1 ${
            isActive
              ? "border-primary/25 bg-primary/10"
              : "border-[#F59E0B]/25 bg-[#F59E0B]/10"
          }`}
        >
          <Text
            className={`text-[11px] font-bold ${
              isActive ? "text-primary" : "text-[#F59E0B]"
            }`}
          >
            {isActive ? "ACTIVE" : "PENDING"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-3">
        {auxiliaryEntries.map((entry) => (
          <View
            className={`rounded-lg border px-3 py-2 ${
              isActive
                ? "border-border bg-secondary"
                : "border-[#F59E0B]/20 bg-[#1B1509]"
            }`}
            key={entry.key}
          >
            <Text className="text-[10px] font-bold uppercase text-muted-foreground">
              {formatAuxiliaryLabel(entry.key)}
            </Text>
            <Text className="mt-1 text-xs font-bold text-white">
              {formatAuxiliaryValue(entry.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function EmptyReferralState() {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-border bg-card">
      <View className="items-center justify-center w-12 h-12 border rounded-xl border-primary/25 bg-primary/10">
        <UsersRound size={23} color="#22C986" strokeWidth={2.4} />
      </View>
      <Text className="mt-4 text-base font-bold text-white">
        No referrals yet
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-muted-foreground">
        Share your referral code to invite users into your network.
      </Text>
    </View>
  );
}

function LoadingReferralState() {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-border bg-card">
      <ActivityIndicator color="#22C986" size="small" />
      <Text className="mt-4 text-base font-bold text-white">
        Loading referrals
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-muted-foreground">
        Fetching your latest referral users.
      </Text>
    </View>
  );
}

function ErrorReferralState({
  isRefetching,
  message,
  onRefetch,
}: {
  isRefetching: boolean;
  message: string;
  onRefetch: () => void;
}) {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-destructive/30 bg-destructive-surface">
      <View className="items-center justify-center w-12 h-12 border rounded-xl border-destructive/25 bg-destructive/10">
        <AlertTriangle size={23} color="#FCA5A5" strokeWidth={2.4} />
      </View>
      <Text className="mt-4 text-base font-bold text-white">
        Failed to load referrals
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-destructive-foreground/80">
        {message}
      </Text>
      <Pressable
        className={`mt-5 flex-row items-center gap-2 rounded-md bg-destructive-foreground px-4 py-2.5 active:opacity-80 ${
          isRefetching ? "opacity-70" : ""
        }`}
        disabled={isRefetching}
        onPress={onRefetch}
      >
        {isRefetching ? (
          <ActivityIndicator color="#3A0B18" size="small" />
        ) : (
          <RefreshCw size={15} color="#3A0B18" strokeWidth={2.6} />
        )}
        <Text className="text-xs font-extrabold text-[#3A0B18]">
          {isRefetching ? "Refetching" : "Refetch"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ReferralScreen() {
  const router = useRouter();
  const toast = useToast();
  const referralCode = useAuthStore((state) => state.referral) ?? "-";
  const {
    data: referralUsers = [],
    error,
    isError,
    isLoading,
    isRefetching,
    refetch,
  } = useReferralQuery();
  const visibleReferralUsers = isError ? [] : referralUsers;
  const activeCount = visibleReferralUsers.filter(
    (node) => parseAuxiliary(node.auxiliary).activated,
  ).length;
  const inactiveCount = visibleReferralUsers.length - activeCount;

  const handleCopyReferralCode = useCallback(async () => {
    await Clipboard.setStringAsync(referralCode);
    toast.info("Referral code copied", referralCode);
  }, [referralCode, toast]);

  const handleRefresh = useCallback(() => {
    refetch().then((result) => {
      if (result.isSuccess) {
        toast.success("Referral refreshed");
      }
    });
  }, [refetch, toast]);

  return (
    <SafeAreaView className="flex-1 bg-[#0B2D22]" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-background/90"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor="#22C986"
            colors={["#22C986"]}
            progressBackgroundColor="#07111F"
            onRefresh={handleRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-b-3xl border-b border-primary/20 bg-[#0B2D22] px-5 pb-8 pt-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              className="items-center justify-center w-10 h-10 border rounded-md border-white/10 bg-white/5 active:opacity-70"
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
            <View className="items-center justify-center w-10 h-10 border rounded-md border-primary/25 bg-primary/10">
              <Network size={20} color="#22C986" strokeWidth={2.4} />
            </View>
          </View>

          <Text className="mt-6 text-2xl font-black text-white">
            My Referrals
          </Text>
          <Text className="mt-2 text-sm leading-5 text-white/75">
            Share your referral code and view the users registered from it.
          </Text>

          <View className="p-4 mt-5 border rounded-2xl border-white/10 bg-white/5">
            <Text className="text-xs font-bold uppercase text-white/60">
              My Referral Code
            </Text>
            <View className="flex-row items-center gap-3 mt-3">
              <View className="flex-1 rounded-xl border border-primary/25 bg-[#061A14] px-4 py-3">
                <Text className="text-lg font-black tracking-[1px] text-white">
                  {referralCode}
                </Text>
              </View>
              <Pressable
                className="items-center justify-center w-12 h-12 rounded-xl bg-primary active:opacity-80"
                onPress={handleCopyReferralCode}
              >
                <Copy size={20} color="#031018" strokeWidth={2.6} />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row gap-2.5">
            <StatTile
              label="Referrals"
              value={`${visibleReferralUsers.length}`}
            />
            <StatTile label="Active" value={`${activeCount}`} />
            <StatTile label="Pending" tone="amber" value={`${inactiveCount}`} />
          </View>

          <View className="flex-row items-center justify-between mt-5">
            <View>
              <Text className="text-lg font-bold text-white">
                Referral Users
              </Text>
              <Text className="mt-0.5 text-xs font-medium text-muted-foreground">
                All referrals are direct users from your code
              </Text>
            </View>
            <View className="items-center justify-center border rounded-md h-9 w-9 border-primary/25 bg-primary/10">
              <UsersRound size={18} color="#22C986" strokeWidth={2.4} />
            </View>
          </View>

          <View className="gap-3 mt-3">
            {isLoading ? (
              <LoadingReferralState />
            ) : isError ? (
              <ErrorReferralState
                isRefetching={isRefetching}
                message={errorMessages(error)}
                onRefetch={refetch}
              />
            ) : visibleReferralUsers.length > 0 ? (
              visibleReferralUsers.map((node) => (
                <ReferralNodeCard key={node.id} node={node} />
              ))
            ) : (
              <EmptyReferralState />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
