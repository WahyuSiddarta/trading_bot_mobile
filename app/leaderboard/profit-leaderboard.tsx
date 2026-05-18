import WreathIcon from "@/assets/icon/wreath";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { leaderboardMock } from "@/mockresponse/leaderboard";
import {
  formatProfit,
  getOrderedPodium,
  isCurrentUser,
  type LeaderboardEntry,
  type PodiumRank,
} from "@/utils/leaderboard";
import { LinearGradient } from "expo-linear-gradient";
import { ChessKing, ChessQueen, Medal } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

type LeaderboardPeriod = "daily" | "weekly" | "monthly";

const routes: { key: LeaderboardPeriod; title: string }[] = [
  { key: "daily", title: "Daily" },
  { key: "weekly", title: "Weekly" },
  { key: "monthly", title: "Monthly" },
];

const leaderboardEntries = leaderboardMock.data;
const podiumStyles = {
  1: {
    accent: "#D7B46A",
    avatar: "border-[#D7B46A]/70 bg-[#D7B46A]/12",
    base: "h-16",
    baseText: "text-[#221A0B]",
    border: "border-[#D7B46A]/45",
    gradient: ["#1C1A15", "#111923", "#07111F"] as const,
    Icon: ChessKing,
    label: "text-[#D7B46A]",
    medal: "Gold",
    rank: "bg-[#D7B46A]",
    text: "text-[#D7B46A]",
  },
  2: {
    accent: "#A7B0BD",
    avatar: "border-[#A7B0BD]/60 bg-[#A7B0BD]/10",
    base: "h-12",
    baseText: "text-[#172231]",
    border: "border-[#A7B0BD]/40",
    gradient: ["#1A2330", "#101923", "#07111F"] as const,
    Icon: ChessQueen,
    label: "text-[#A7B0BD]",
    medal: "Silver",
    rank: "bg-[#A7B0BD]",
    text: "text-[#A7B0BD]",
  },
  3: {
    accent: "#B48162",
    avatar: "border-[#B48162]/55 bg-[#B48162]/10",
    base: "h-10",
    baseText: "text-[#21100A]",
    border: "border-[#B48162]/40",
    gradient: ["#201A16", "#111923", "#07111F"] as const,
    Icon: Medal,
    label: "text-[#B48162]",
    medal: "Bronze",
    rank: "bg-[#B48162]",
    text: "text-[#B48162]",
  },
} as const;

function ProfitPill({ profit }: { profit: number }) {
  const isPositive = profit > 0;

  return (
    <View
      className={`items-end rounded-full border px-2.5 py-1 ${
        isPositive
          ? "border-primary/20 bg-primary/15"
          : "border-border bg-secondary"
      }`}
    >
      <Text
        className={`font-semibold text-[11px] ${
          isPositive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {formatProfit(profit)}
      </Text>
    </View>
  );
}

function PodiumCard({
  entry,
  rank,
  featured = false,
}: {
  entry: LeaderboardEntry;
  rank: PodiumRank;
  featured?: boolean;
}) {
  const isCurrentUserPodium = isCurrentUser(entry);
  const podiumStyle = podiumStyles[rank];
  const PodiumIcon = podiumStyle.Icon;
  const wreathSize = featured ? 58 : 50;

  return (
    <View className="justify-end flex-1">
      <LinearGradient
        className={`overflow-hidden rounded-t-lg border border-b-0 ${podiumStyle.border}`}
        colors={podiumStyle.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          elevation: featured ? 5 : 3,
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: featured ? 6 : 4 },
          shadowOpacity: featured ? 0.16 : 0.1,
          shadowRadius: featured ? 12 : 8,
        }}
      >
        <View className="absolute top-0 left-0 right-0 h-8 opacity-20">
          <LinearGradient
            className="h-full"
            colors={[podiumStyle.accent, "transparent"]}
            end={{ x: 0.5, y: 1 }}
            start={{ x: 0.5, y: 0 }}
          />
        </View>

        <View className="absolute right-2 top-2">
          <PodiumIcon
            color={podiumStyle.accent}
            size={featured ? 18 : 16}
            strokeWidth={2.3}
          />
        </View>

        <View className="items-center px-2 pt-2 pb-2.5">
          {isCurrentUserPodium ? (
            <View className="absolute left-2 top-2 rounded-full border border-primary/70 bg-primary/90 px-1.5 py-0.5">
              <Text className="font-bold text-[10px] text-primary-foreground">
                YOU
              </Text>
            </View>
          ) : null}

          <View className="items-center justify-center mb-1.5">
            <WreathIcon
              color={podiumStyle.accent}
              height={wreathSize}
              opacity={featured ? 0.92 : 0.78}
              width={wreathSize}
            />
          </View>

          <Text
            className="max-w-full text-xs font-semibold text-white"
            numberOfLines={1}
          >
            {entry.username}
          </Text>
          <Text
            className={`mb-1.5 font-medium text-[10px] ${podiumStyle.label}`}
          >
            {podiumStyle.medal}
          </Text>
          <ProfitPill profit={entry.profit} />
        </View>
      </LinearGradient>

      <View
        className={`items-center justify-center rounded-lg ${podiumStyle.rank} ${podiumStyle.base}`}
        style={{
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        }}
      >
        <Text className={`text-xl font-black ${podiumStyle.baseText}`}>
          #{rank}
        </Text>
      </View>
    </View>
  );
}

function LeaderboardRow({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const isCurrentUserRow = isCurrentUser(entry);
  const podiumRowStyle =
    rank <= 3 ? podiumStyles[rank as PodiumRank] : undefined;
  const rowAccent =
    podiumRowStyle?.accent ?? (isCurrentUserRow ? "#22C986" : "#8DA0B6");
  const wreathColor = rowAccent;
  const rankColor =
    podiumRowStyle?.text ??
    (isCurrentUserRow ? "text-primary" : "text-[#A8B6C8]");

  const rowGradient = podiumRowStyle
    ? podiumRowStyle.gradient
    : isCurrentUserRow
      ? (["#173824", "#101C19", "#07111F"] as const)
      : (["#152235", "#0E1726", "#07111F"] as const);
  const borderClassName = podiumRowStyle
    ? podiumRowStyle.border
    : isCurrentUserRow
      ? "border-primary/80"
      : "border-[#2A3B50]";

  return (
    <LinearGradient
      className={`overflow-hidden rounded-xl border ${borderClassName}`}
      colors={rowGradient}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{
        shadowColor: rowAccent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: podiumRowStyle ? 0.1 : isCurrentUserRow ? 0.12 : 0.06,
        shadowRadius: 8,
      }}
    >
      <View className="absolute top-0 right-0 w-16 h-full opacity-10">
        <LinearGradient
          className="h-full"
          colors={[wreathColor, "transparent"]}
          end={{ x: 0, y: 0.5 }}
          start={{ x: 1, y: 0.5 }}
        />
      </View>

      <View className="flex-row items-center gap-2.5 px-3 py-2">
        <View className="items-center w-14">
          <Text className={`text-[10px] font-bold uppercase ${rankColor}`}>
            {podiumRowStyle?.medal ?? "Rank"}
          </Text>
          <Text className={`mt-0.5 text-base font-extrabold ${rankColor}`}>
            #{rank}
          </Text>
        </View>

        <View className="items-center justify-center w-11 h-11">
          <WreathIcon
            width={44}
            height={44}
            color={wreathColor}
            opacity={isCurrentUserRow ? 0.9 : 0.72}
          />
        </View>

        <View className="flex-1 min-w-0">
          <Text className="text-sm font-semibold text-white" numberOfLines={1}>
            {entry.username}
          </Text>
          <Text
            className={`mt-0.5 font-medium text-[11px] ${
              isCurrentUserRow ? "text-primary" : "text-[#A9B8C8]"
            }`}
          >
            {isCurrentUserRow ? "You" : "Trader profit"}
          </Text>
        </View>

        <ProfitPill profit={entry.profit} />
      </View>
    </LinearGradient>
  );
}

function PodiumSkeleton() {
  return (
    <View className="flex-row items-end gap-3">
      {[2, 1, 3].map((rank) => (
        <View className="justify-end flex-1" key={rank}>
          <View className="items-center px-2 pt-2 pb-2.5 border border-b-0 rounded-t-lg border-border bg-card">
            <Skeleton className="w-12 h-12 mb-1.5 rounded-full" />
            <Skeleton className="w-14 h-3 mb-1.5" />
            <Skeleton className="mb-1.5 h-2.5 w-9" />
            <Skeleton className="h-6 rounded-full w-[72px]" />
          </View>
          <Skeleton
            className={`rounded-b-lg ${
              rank === 1 ? "h-16" : rank === 2 ? "h-12" : "h-10"
            }`}
          />
        </View>
      ))}
    </View>
  );
}

function LeaderboardRowSkeleton() {
  return (
    <View className="overflow-hidden border rounded-lg border-border bg-card">
      <View className="flex-row items-center gap-2.5 px-3 py-2">
        <View className="items-center w-10">
          <Skeleton className="h-2.5 mb-1 w-8" />
          <Skeleton className="h-4 w-7" />
        </View>

        <Skeleton className="rounded-full w-11 h-11" />

        <View className="flex-1">
          <Skeleton className="h-3.5 mb-2 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </View>

        <Skeleton className="h-6 rounded-full w-[72px]" />
      </View>
    </View>
  );
}

export function LeaderboardList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orderedPodium = getOrderedPodium(leaderboardEntries);

  const simulateFetch = useCallback((showRefreshIndicator = false) => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    setIsLoading(true);
    setIsRefreshing(showRefreshIndicator);

    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
      loadingTimerRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    simulateFetch();
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [simulateFetch]);

  const handleRefresh = useCallback(() => {
    simulateFetch(true);
  }, [simulateFetch]);

  const [activeTab, setActiveTab] = useState("daily");
  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#3CFF88"
          colors={["#3CFF88"]}
          progressBackgroundColor="#07111F"
        />
      }
    >
      <View className="px-4 pt-3">
        <AnimatedTabs
          items={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
          ]}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          maxPerRow={3}
        />
      </View>
      <View className="px-4 pt-3">
        <View className="flex-row items-end justify-between mb-3">
          <View>
            <Text className="text-[11px] font-bold uppercase text-primary">
              Top Traders
            </Text>
            <Text className="mt-0.5 text-lg font-bold text-white">
              Profit Leaderboard
            </Text>
          </View>
        </View>

        {isLoading ? (
          <PodiumSkeleton />
        ) : (
          <View className="flex-row items-end gap-2.5">
            {orderedPodium.map((podiumItem) => (
              <PodiumCard
                entry={podiumItem.entry}
                featured={podiumItem.featured}
                key={podiumItem.entry.user_id}
                rank={podiumItem.rank}
              />
            ))}
          </View>
        )}
      </View>
      <View className="gap-2.5 px-4 pt-4 pb-6">
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <LeaderboardRowSkeleton key={index} />
            ))
          : leaderboardEntries.length > 0 &&
            leaderboardEntries.map((entry, index) => (
              <LeaderboardRow
                entry={entry}
                rank={index + 1}
                key={entry.user_id}
              />
            ))}
      </View>
    </ScrollView>
  );
}
