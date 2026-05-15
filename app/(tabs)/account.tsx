import {
  Bell,
  ChevronRight,
  Fingerprint,
  Flame,
  Gauge,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageCircle,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profitResponse = {
  code: "DATA_PROFIT_RETRIEVED",
  daily: null,
  data: null,
  elapsed: 0.005372955,
  len: 0,
  status: "OK",
  summary: {
    today: 0,
    last7: 0,
    last30: 0,
    last90: 0,
    alltime: 0,
  },
};

const profileAccess = {
  page_setting: true,
  page_info: true,
  page_dashboard: true,
  page_market: true,
  page_order: true,
  page_position: true,
  page_profit: true,
  page_api: true,
  page_gas: true,
  page_bonus: true,
  page_referral: true,
  act_wd: true,
  act_wd_wallet: true,
  page_leaderboard: true,
};

const gasResponse = {
  code: "GAS_AND_FEE_RETRIEVED",
  elapsed: 0.004166795,
  gas: {
    gas: 0,
    used_gas: 0,
  },
  gas_record: [],
  status: "OK",
  wallet: {
    credit: 0,
    locked: 0,
  },
};

const profitSummary = [
  { label: "Today", value: profitResponse.summary.today },
  { label: "7D", value: profitResponse.summary.last7 },
  { label: "30D", value: profitResponse.summary.last30 },
  { label: "90D", value: profitResponse.summary.last90 },
  { label: "All", value: profitResponse.summary.alltime },
];

const profileProfitSummary = profitSummary.slice(0, 3);

const accountMenus = [
  {
    title: "Notification",
    description: "App alerts and trading activity updates",
    Icon: Bell,
  },
  {
    title: "Telegram Setting",
    description: "Bot alerts and account notifications",
    Icon: MessageCircle,
  },
  {
    title: "Security Email",
    description: "Manage recovery and login verification email",
    Icon: Mail,
  },
  {
    title: "Security PIN",
    description: "Protect withdrawals and sensitive actions",
    Icon: LockKeyhole,
  },
  {
    title: "Google Authenticator",
    description: "Two-factor authentication token setup",
    Icon: Fingerprint,
  },
  {
    title: "API Key",
    description: "Trading API credentials and permissions",
    Icon: KeyRound,
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function StatusPill({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-white/20 px-2.5 py-0.5">
      <Text className="text-xs font-bold text-white">{label}</Text>
    </View>
  );
}

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: LucideIcon;
}) {
  return (
    <View className="flex-1">
      <View className="mb-2 h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={17} color="#22C986" strokeWidth={2.4} />
      </View>
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
      <Text className="mt-1 text-lg font-bold text-white">{value}</Text>
    </View>
  );
}

function MenuRow({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
}) {
  return (
    <Pressable className="flex-row items-center gap-3 py-3 active:opacity-70">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
        <Icon size={18} color="#22C986" strokeWidth={2.3} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{title}</Text>
        <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
          {description}
        </Text>
      </View>
      <ChevronRight size={19} color="#7d93a5" strokeWidth={2.4} />
    </Pressable>
  );
}

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background/90" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-background/90"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-b-[42px] bg-[#0B2D22]">
          <View className="px-5 pb-12 pt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase text-white/85">
                Profile
              </Text>
              <StatusPill
                label={profileAccess.page_setting ? "Active" : "Limited"}
              />
            </View>
            <View className="mt-6 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-primary/25">
                <UserRound size={36} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text className="mt-3 text-xl font-bold text-white">Account</Text>
              <Text className="mt-1 text-center text-xs leading-4 text-white/80">
                Manage security, notification, gas balance, and trading access.
              </Text>
            </View>
          </View>
        </View>

        <View className="-mt-8 px-5">
          <View className="rounded-3xl bg-card p-3">
            <View className="flex-row gap-2.5">
              {profileProfitSummary.map((item) => (
                <View
                  key={item.label}
                  className="flex-1 items-center rounded-2xl bg-secondary px-2 py-2.5"
                >
                  <Text className="text-sm font-bold text-white">
                    {formatNumber(item.value)}
                  </Text>
                  <Text className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-5 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-white">
                Gas & Wallet
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                Balance and usage snapshot
              </Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#3A2513]">
              <Flame size={20} color="#F59E0B" strokeWidth={2.4} />
            </View>
          </View>

          <View className="rounded-3xl bg-card px-4 py-3.5">
            <View className="flex-row gap-3">
              <StatCard
                Icon={Gauge}
                label="Gas"
                value={formatNumber(gasResponse.gas.gas)}
              />
              <StatCard
                Icon={Flame}
                label="Used Gas"
                value={formatNumber(gasResponse.gas.used_gas)}
              />
            </View>
            <View className="mt-4 flex-row gap-3">
              <StatCard
                Icon={Wallet}
                label="Credit"
                value={formatNumber(gasResponse.wallet.credit)}
              />
              <StatCard
                Icon={LockKeyhole}
                label="Locked"
                value={formatNumber(gasResponse.wallet.locked)}
              />
            </View>
          </View>
        </View>

        <View className="mt-5 px-5">
          <View className="rounded-3xl bg-card px-4 py-3">
            <Text className="mb-1 text-lg font-bold text-white">
              Account Menu
            </Text>
            {accountMenus.map((item) => (
              <MenuRow key={item.title} {...item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
