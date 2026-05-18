import { leaderboardMock } from "@/mockresponse/leaderboard";

export type LeaderboardEntry = (typeof leaderboardMock.data)[number];
export type PodiumRank = 1 | 2 | 3;

const currentUserMock = {
  user_id: "7e48704f-cf59-483e-b6c2-181f0a8699ea",
};

export function formatProfit(profit: number) {
  const normalizedProfit = Number(profit.toFixed(4));

  if (normalizedProfit === 0) {
    return "0.0000";
  }

  return `${normalizedProfit > 0 ? "+" : ""}${normalizedProfit.toFixed(4)}`;
}

export function isCurrentUser(entry: LeaderboardEntry) {
  return entry.user_id === currentUserMock.user_id;
}

export function getOrderedPodium(entries: LeaderboardEntry[]) {
  const [firstPlace, secondPlace, thirdPlace] = entries.slice(0, 3);

  return [
    secondPlace && { entry: secondPlace, rank: 2 as const },
    firstPlace && { entry: firstPlace, rank: 1 as const, featured: true },
    thirdPlace && { entry: thirdPlace, rank: 3 as const },
  ].filter(Boolean) as {
    entry: LeaderboardEntry;
    featured?: boolean;
    rank: PodiumRank;
  }[];
}
