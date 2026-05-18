import { Tabs } from "expo-router";
import {
  ChartCandlestick,
  CircleUserRound,
  House,
  KeyRound,
  Medal,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { PrivateAlertStrip } from "@/components/private-alert-strip";
import { Colors } from "@/constants/theme";

type TabIconProps = {
  Icon: LucideIcon;
  color: string;
  focused: boolean;
};

function TabIcon({ Icon, color, focused }: TabIconProps) {
  return (
    <View
      className={`h-9 w-11 items-center justify-center rounded-xl ${
        focused ? "bg-[#123047]" : "bg-transparent"
      }`}
    >
      <Icon
        size={focused ? 22 : 20}
        color={color}
        strokeWidth={focused ? 2.6 : 2.2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <View className="flex-1 bg-background">
      <PrivateAlertStrip />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.dark.tint,
          tabBarInactiveTintColor: Colors.dark.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: Colors.dark.secondaryBackgroundColor,
            borderTopColor: Colors.dark.border,
            borderTopWidth: 1,
            height: 96,
            paddingTop: 7,
            paddingBottom: 30,
            shadowColor: Colors.dark.background,
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 12,
          },
          tabBarItemStyle: {
            paddingVertical: 3,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            marginTop: 9,
          },
          tabBarIconStyle: {
            marginTop: 1,
          },
          sceneStyle: {
            backgroundColor: Colors.dark.background,
          },
        }}
      >
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Rank",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={Medal} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="api-keys"
          options={{
            title: "API Keys",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={KeyRound} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="signals"
          options={{
            href: null,
            title: "Services",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={ChartCandlestick}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={House} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={Wallet} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={CircleUserRound} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
