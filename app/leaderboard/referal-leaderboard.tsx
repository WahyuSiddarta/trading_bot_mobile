import WreathIcon from "@/assets/icon/wreath";
import { Skeleton } from "@/components/ui/skeleton";
import { leaderboardMock } from "@/mockresponse/leaderboard";
import { LinearGradient } from "expo-linear-gradient";
import { ChessKing, ChessQueen, Medal } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

type LeaderboardEntry = (typeof leaderboardMock.data)[number];
type PodiumRank = 1 | 2 | 3;

const leaderboardEntries = leaderboardMock.data;
const currentUserMock = {
  user_id: "7e48704f-cf59-483e-b6c2-181f0a8699ea",
  username: "cobra777",
};
const podiumStyles = {
  1: {
    accent: "#F8C847",
    avatar: "border-[#F8C847] bg-[#F8C847]/20",
    base: "h-24",
    baseText: "text-[#2B1B03]",
    border: "border-[#F8C847]",
    gradient: ["#3A2A08", "#151205", "#07111f"] as const,
    Icon: ChessKing,
    label: "text-[#F8C847]",
    medal: "Gold",
    rank: "bg-[#F8C847]",
    text: "text-[#F8C847]",
  },
  2: {
    accent: "#D6DEE8",
    avatar: "border-[#D6DEE8] bg-[#D6DEE8]/15",
    base: "h-16",
    baseText: "text-[#172231]",
    border: "border-[#D6DEE8]",
    gradient: ["#24313E", "#101A25", "#07111f"] as const,
    Icon: ChessQueen,
    label: "text-[#D6DEE8]",
    medal: "Silver",
    rank: "bg-[#D6DEE8]",
    text: "text-[#D6DEE8]",
  },
  3: {
    accent: "#C9784B",
    avatar: "border-[#C9784B] bg-[#C9784B]/15",
    base: "h-12",
    baseText: "text-[#21100A]",
    border: "border-[#C9784B]",
    gradient: ["#3A2014", "#160F0C", "#07111f"] as const,
    Icon: Medal,
    label: "text-[#C9784B]",
    medal: "Bronze",
    rank: "bg-[#C9784B]",
    text: "text-[#C9784B]",
  },
} as const;

function formatProfit(profit: number) {
  const normalizedProfit = Number(profit.toFixed(4));

  if (normalizedProfit === 0) {
    return "0.0000";
  }

  return `${normalizedProfit > 0 ? "+" : ""}${normalizedProfit.toFixed(4)}`;
}

function isCurrentUser(entry: LeaderboardEntry) {
  return entry.user_id === currentUserMock.user_id;
}

function ProfitPill({ profit }: { profit: number }) {
  const isPositive = profit > 0;

  return (
    <View
      className={`items-end rounded-full border px-3 py-1.5 ${
        isPositive
          ? "border-primary/20 bg-primary/15"
          : "border-border bg-secondary"
      }`}
    >
      <Text
        className={`font-semibold text-xs ${
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
  const wreathSize = featured ? 78 : 68;

  return (
    <View className="justify-end flex-1">
      <LinearGradient
        className={`overflow-hidden rounded-t-xl border border-b-0 ${podiumStyle.border}`}
        colors={podiumStyle.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          elevation: featured ? 10 : 5,
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: featured ? 10 : 6 },
          shadowOpacity: featured ? 0.24 : 0.14,
          shadowRadius: featured ? 18 : 12,
        }}
      >
        <View className="absolute top-0 left-0 right-0 h-12 opacity-30">
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
            size={featured ? 22 : 18}
            strokeWidth={2.3}
          />
        </View>

        <View className="items-center px-2 pt-3 pb-3">
          {isCurrentUserPodium ? (
            <View className="absolute left-2 top-2 rounded-full border border-primary bg-primary px-2 py-0.5">
              <Text className="font-bold text-[10px] text-primary-foreground">
                YOU
              </Text>
            </View>
          ) : null}

          <View className="items-center justify-center mb-2">
            <WreathIcon
              color={podiumStyle.accent}
              height={wreathSize}
              opacity={featured ? 0.92 : 0.78}
              width={wreathSize}
            />
          </View>

          <Text
            className="max-w-full text-sm font-semibold text-white"
            numberOfLines={1}
          >
            {entry.username}
          </Text>
          <Text className={`mb-2 font-medium text-[11px] ${podiumStyle.label}`}>
            {podiumStyle.medal}
          </Text>
          <ProfitPill profit={entry.profit} />
        </View>
      </LinearGradient>

      <View
        className={`items-center justify-center rounded-xl ${podiumStyle.rank} ${podiumStyle.base}`}
        style={{
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        }}
      >
        <Text className={`text-3xl font-black ${podiumStyle.baseText}`}>
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
    podiumRowStyle?.accent ?? (isCurrentUserRow ? "#3CFF88" : "#C9784B");
  const wreathColor = rowAccent;
  const rankColor =
    podiumRowStyle?.text ??
    (isCurrentUserRow ? "text-primary" : "text-[#F3C36B]");
  const avatarClassName =
    podiumRowStyle?.avatar ??
    (isCurrentUserRow
      ? "border-primary/80 bg-primary/20"
      : "border-[#C9784B]/50 bg-[#271D18]");
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
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: podiumRowStyle ? 0.16 : isCurrentUserRow ? 0.18 : 0.1,
        shadowRadius: 14,
      }}
    >
      <View className="absolute top-0 right-0 w-24 h-full opacity-20">
        <LinearGradient
          className="h-full"
          colors={[wreathColor, "transparent"]}
          end={{ x: 0, y: 0.5 }}
          start={{ x: 1, y: 0.5 }}
        />
      </View>

      <View className="flex-row items-center gap-3 px-3 py-1">
        <View className="items-center w-12">
          <Text className={`text-xs font-bold uppercase ${rankColor}`}>
            {podiumRowStyle?.medal ?? "Rank"}
          </Text>
          <Text className={`mt-0.5 text-lg font-extrabold ${rankColor}`}>
            #{rank}
          </Text>
        </View>

        <View className="items-center justify-center w-16 h-16">
          <WreathIcon
            width={64}
            height={64}
            color={wreathColor}
            opacity={isCurrentUserRow ? 0.9 : 0.72}
          />
        </View>

        <View className="flex-1 min-w-0">
          <Text
            className="text-base font-semibold text-white"
            numberOfLines={1}
          >
            {entry.username}
          </Text>
          <Text
            className={`mt-1 font-medium text-xs ${
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
          <View className="items-center px-2 pt-3 pb-3 border border-b-0 rounded-t-xl border-border bg-card">
            <Skeleton className="w-16 h-16 mb-2 rounded-full" />
            <Skeleton className="w-16 h-3 mb-2" />
            <Skeleton className="mb-2 h-2.5 w-10" />
            <Skeleton className="w-20 rounded-full h-7" />
          </View>
          <Skeleton
            className={`rounded-b-xl ${
              rank === 1 ? "h-24" : rank === 2 ? "h-16" : "h-12"
            }`}
          />
        </View>
      ))}
    </View>
  );
}

function LeaderboardRowSkeleton() {
  return (
    <View className="overflow-hidden border rounded-xl border-border bg-card">
      <View className="flex-row items-center gap-3 px-3 py-1">
        <View className="items-center w-12">
          <Skeleton className="h-3 mb-1 w-9" />
          <Skeleton className="w-8 h-5" />
        </View>

        <Skeleton className="w-16 h-16 rounded-full" />

        <View className="flex-1">
          <Skeleton className="h-4 mb-2 w-28" />
          <Skeleton className="w-20 h-3" />
        </View>

        <Skeleton className="w-20 rounded-full h-7" />
      </View>
    </View>
  );
}

export function ReferralLeaderboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topThree = leaderboardEntries.slice(0, 3);
  const [firstPlace, secondPlace, thirdPlace] = topThree;
  const orderedPodium = [
    secondPlace && { entry: secondPlace, rank: 2 as const },
    firstPlace && { entry: firstPlace, rank: 1 as const, featured: true },
    thirdPlace && { entry: thirdPlace, rank: 3 as const },
  ].filter(Boolean) as {
    entry: LeaderboardEntry;
    featured?: boolean;
    rank: PodiumRank;
  }[];

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
      <View className="px-5 pt-4">
        <View className="flex-row items-end justify-between mb-4">
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-primary">
              Top users
            </Text>
            <Text className="mt-1 text-2xl font-bold tracking-tighter text-white">
              Referal Ranking
            </Text>
          </View>
        </View>

        {isLoading ? (
          <PodiumSkeleton />
        ) : (
          <View className="flex-row items-end gap-3">
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
      <View className="gap-3 px-5 pt-6 pb-6">
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
