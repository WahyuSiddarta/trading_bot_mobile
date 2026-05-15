import WreathIcon from "@/assets/icon/wreath";
import { leaderboardMock } from "@/mockresponse/leaderboard";
import { LinearGradient } from "expo-linear-gradient";
import { ChessKing, ChessQueen, Medal } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

type LeaderboardEntry = (typeof leaderboardMock.data)[number];
type LeaderboardPeriod = "daily" | "weekly" | "monthly";
type PodiumRank = 1 | 2 | 3;

const routes: { key: LeaderboardPeriod; title: string }[] = [
  { key: "daily", title: "Daily" },
  { key: "weekly", title: "Weekly" },
  { key: "monthly", title: "Monthly" },
];

const leaderboardEntries = leaderboardMock.data;
const currentUserMock = {
  user_id: "1f4dc039-50d3-48e1-b732-d0fef40cf7a6",
  username: "wsd97",
};
const podiumStyles = {
  1: {
    accent: "#F8C847",
    avatar: "h-20 w-20 border-[#F8C847] bg-[#F8C847]/20",
    border: "border-[#F8C847]",
    card: "min-h-[228px]",
    gradient: ["#3A2A08", "#151205", "#07111f"] as const,
    Icon: ChessKing,
    label: "text-[#F8C847]",
    medal: "Gold",
    rank: "bg-[#F8C847]",
    text: "text-[#F8C847]",
    tower: "h-14 bg-[#F8C847]",
  },
  2: {
    accent: "#D6DEE8",
    avatar: "h-16 w-16 border-[#D6DEE8] bg-[#D6DEE8]/15",
    border: "border-[#D6DEE8]",
    card: "min-h-[200px]",
    gradient: ["#24313E", "#101A25", "#07111f"] as const,
    Icon: ChessQueen,
    label: "text-[#D6DEE8]",
    medal: "Silver",
    rank: "bg-[#D6DEE8]",
    text: "text-[#D6DEE8]",
    tower: "h-10 bg-[#D6DEE8]",
  },
  3: {
    accent: "#C9784B",
    avatar: "h-16 w-16 border-[#C9784B] bg-[#C9784B]/15",
    border: "border-[#C9784B]",
    card: "min-h-[188px]",
    gradient: ["#3A2014", "#160F0C", "#07111f"] as const,
    Icon: Medal,
    label: "text-[#C9784B]",
    medal: "Bronze",
    rank: "bg-[#C9784B]",
    text: "text-[#C9784B]",
    tower: "h-8 bg-[#C9784B]",
  },
} as const;

function formatProfit(profit: number) {
  const normalizedProfit = Number(profit.toFixed(4));

  if (normalizedProfit === 0) {
    return "0.0000";
  }

  return `${normalizedProfit > 0 ? "+" : ""}${normalizedProfit.toFixed(4)}`;
}

function getInitial(username: string) {
  return username.trim().charAt(0).toUpperCase();
}

function isCurrentUser(entry: LeaderboardEntry) {
  return entry.user_id === currentUserMock.user_id;
}

function RankBadge({ rank }: { rank: number }) {
  const isPodium = rank <= 3;
  const badgeClassName = isPodium
    ? "bg-primary"
    : "border border-border bg-background";
  const textClassName = isPodium ? "text-primary-foreground" : "text-white";

  return (
    <View
      className={`h-10 w-10 items-center justify-center rounded-full ${badgeClassName}`}
    >
      <Text className={`font-bold text-sm ${textClassName}`}>
        {isPodium ? `#${rank}` : `${rank}th`}
      </Text>
    </View>
  );
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

  return (
    <View className="flex-1">
      <LinearGradient
        className={`overflow-hidden rounded-lg border ${podiumStyle.border} ${podiumStyle.card}`}
        colors={podiumStyle.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          elevation: featured ? 12 : 6,
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: featured ? 14 : 8 },
          shadowOpacity: featured ? 0.32 : 0.18,
          shadowRadius: featured ? 22 : 14,
        }}
      >
        <View className="absolute top-0 left-0 right-0 h-16 opacity-30">
          <LinearGradient
            className="h-full"
            colors={[podiumStyle.accent, "transparent"]}
            end={{ x: 0.5, y: 1 }}
            start={{ x: 0.5, y: 0 }}
          />
        </View>

        <View className="absolute right-3 top-3">
          <PodiumIcon
            color={podiumStyle.accent}
            size={featured ? 24 : 20}
            strokeWidth={2.3}
          />
        </View>

        <View className="items-center px-2 pt-4 pb-4">
          {isCurrentUserPodium ? (
            <View className="absolute left-2 top-2 rounded-full border border-primary bg-primary px-2 py-0.5">
              <Text className="font-bold text-[10px] text-primary-foreground">
                YOU
              </Text>
            </View>
          ) : null}

          <View className={`mb-3 rounded-full px-3 py-1.5 ${podiumStyle.rank}`}>
            <Text className="text-xs font-bold text-background">#{rank}</Text>
          </View>

          <View
            className={`mb-3 items-center justify-center rounded-full border-2 ${podiumStyle.avatar}`}
          >
            <Text
              className={`font-bold ${featured ? "text-3xl" : "text-2xl"} ${
                podiumStyle.text
              }`}
            >
              {getInitial(entry.username)}
            </Text>
          </View>

          <Text
            className="max-w-full mb-1 text-sm font-semibold text-white"
            numberOfLines={1}
          >
            {entry.username}
          </Text>
          <Text className={`mb-3 font-medium text-xs ${podiumStyle.label}`}>
            {podiumStyle.medal}
          </Text>
          <ProfitPill profit={entry.profit} />
        </View>
      </LinearGradient>

      <View
        className={`mx-2 rounded-b-lg opacity-80 ${podiumStyle.tower}`}
        style={{
          shadowColor: podiumStyle.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
        }}
      />
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

  return (
    <View
      className={`overflow-hidden rounded-xl border ${
        isCurrentUserRow ? "border-primary bg-accent" : "border-border bg-card"
      }`}
    >
      <View className="flex-row items-center gap-3 px-4 py-3.5 pl-5">
        <RankBadge rank={rank} />

        <WreathIcon width={50} height={50} color={"red"} />
        <View
          className={`h-12 w-12 items-center justify-center rounded-full border ${
            isCurrentUserRow
              ? "border-primary bg-primary/20"
              : "border-border bg-secondary"
          }`}
        >
          <Text
            className={`font-bold text-lg ${
              isCurrentUserRow ? "text-primary" : "text-white"
            }`}
          >
            {getInitial(entry.username)}
          </Text>
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
              isCurrentUserRow ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isCurrentUserRow ? "You" : "Trader profit"}
          </Text>
        </View>

        <ProfitPill profit={entry.profit} />
      </View>
    </View>
  );
}

export function LeaderboardList() {
  const topThree = leaderboardEntries.slice(0, 3);
  const remainingEntries = leaderboardEntries.slice(3);
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

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-5 pt-4">
        <View className="flex-row items-end justify-between mb-4">
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-primary">
              Top Traders
            </Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              Profit Leaderboard
            </Text>
          </View>
          <View className="rounded-full border border-border bg-secondary px-3 py-1.5">
            <Text className="text-xs font-semibold text-muted-foreground">
              {leaderboardMock.period}
            </Text>
          </View>
        </View>

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
      </View>
      <View className="gap-3 px-5 pt-6 pb-6">
        {remainingEntries.length > 0 &&
          remainingEntries.map((entry, index) => (
            <LeaderboardRow
              entry={entry}
              rank={index + 4}
              key={entry.user_id}
            />
          ))}
      </View>
    </ScrollView>
  );
}
