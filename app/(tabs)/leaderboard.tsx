import { Colors } from "@/constants/theme";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

import { LeaderboardList } from "../leaderboard/profit-leaderboard";

export default function Leaderboard() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <View className="flex-1 w-full bg-background/90">
      <SafeAreaView
        className="flex flex-1"
        style={{ backgroundColor: Colors.dark.secondaryBackgroundColor }}
        edges={["top"]}
      >
        <TabView
          commonOptions={{
            labelStyle: {
              fontFamily: "Inter-SemiBold",
              fontSize: 13,
            },
          }}
          initialLayout={{ width: layout.width }}
          navigationState={{
            index,
            routes: [
              { key: "profit", title: "Profit" },
              { key: "referral", title: "Referral" },
            ],
          }}
          onIndexChange={setIndex}
          renderScene={() => <LeaderboardList />}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              activeColor={Colors.dark.tint}
              inactiveColor="#7d93a5"
              indicatorStyle={{
                backgroundColor: Colors.dark.tint,
                borderRadius: 999,
                height: 3,
              }}
              pressColor="rgba(34, 201, 134, 0.12)"
              style={{
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: Colors.dark.secondaryBackgroundColor,
              }}
              tabStyle={{
                zIndex: 0,
                minHeight: 44,
              }}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}
