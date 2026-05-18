import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CircleCheck,
  CircleX,
  Copy,
  FileText,
  FileWarning,
  Fingerprint,
  Flame,
  Gauge,
  KeyRound,
  KeySquare,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  ScanFace,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth-store";

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
const referralCode = "TBOT-8X4K2";
const notificationCount = 3;
const pushNotificationsEnabled = true;
const appVersion = "v1.0.0";

const telegramSetting = {
  title: "Telegram Setting",
  description: "Bot alerts and account notifications",
  Icon: MessageCircle,
  isActive: true,
};

const securityMenus = [
  {
    title: "Security Email",
    description: "Manage recovery and login verification email",
    Icon: Mail,
    isActive: true,
  },
  {
    title: "Security PIN",
    description: "Protect withdrawals and sensitive actions",
    Icon: LockKeyhole,
    isActive: false,
  },
  {
    title: "Change Password",
    description: "Update account login password",
    Icon: KeySquare,
  },
  {
    title: "Google Authenticator",
    description: "Two-factor authentication token setup",
    Icon: Fingerprint,
    isActive: false,
  },
  {
    title: "Anti Phishing",
    description: "Verify official emails with a custom security phrase",
    Icon: FileWarning,
    isActive: false,
  },
  {
    title: "Biometric",
    description: "Use device biometrics for faster account unlock",
    Icon: ScanFace,
    isActive: true,
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function NotificationButton({ count }: { count: number }) {
  return (
    <Pressable className="relative h-9 w-9 items-center justify-center rounded-md border border-[#F59E0B]/35 bg-[#F59E0B]/10 active:opacity-70">
      <Bell size={18} color="#F59E0B" strokeWidth={2.4} />
      <View className="absolute -right-1 -top-1 min-w-5 items-center rounded-full bg-[#F59E0B] px-1 py-0.5">
        <Text className="text-[10px] font-bold text-[#120B03]">{count}</Text>
      </View>
    </Pressable>
  );
}

function BalanceRow({
  title,
  subtitle,
  value,
  actionLabel,
  Icon,
}: {
  title: string;
  subtitle: string;
  value: string;
  actionLabel: string;
  Icon: LucideIcon;
}) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className="items-center justify-center border rounded-md h-9 w-9 border-border bg-secondary">
        <Icon size={18} color="#22C986" strokeWidth={2.4} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{title}</Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Text className="text-sm font-bold text-right text-white min-w-10">
          {value}
        </Text>
        <Pressable
          className={`min-w-[84px] items-center rounded-md px-2.5 py-1.5 active:opacity-70 ${
            actionLabel === "Withdraw" ? "bg-[#38BDF8]" : "bg-primary"
          }`}
        >
          <Text className="text-xs font-bold text-[#031018]">
            {actionLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PushNotificationRow({ enabled }: { enabled: boolean }) {
  return (
    <View className="flex-row items-center gap-3 py-2.5">
      <View className="h-9 w-9 items-center justify-center rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10">
        <Bell size={18} color="#F59E0B" strokeWidth={2.4} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">
          Push Notifications
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">
          Trading alerts and account activity
        </Text>
      </View>
      <Switch
        ios_backgroundColor="#123047"
        thumbColor={enabled ? "#FFFFFF" : "#7d93a5"}
        trackColor={{ false: "#123047", true: "#F59E0B" }}
        value={enabled}
      />
    </View>
  );
}

function ReferralRow({
  onCopy,
  onPress,
}: {
  onCopy: () => void;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="flex-row items-center gap-3 py-2.5 active:opacity-70"
      onPress={onPress}
    >
      <View className="items-center justify-center border rounded-md h-9 w-9 border-border bg-secondary">
        <UsersRound size={18} color="#22C986" strokeWidth={2.4} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-medium text-muted-foreground">
          Referral Code
        </Text>
        <Text className="mt-0.5 text-base font-bold text-white">
          {referralCode}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          className="flex-row items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 active:opacity-70"
          onPress={(event) => {
            event.stopPropagation();
            onCopy();
          }}
        >
          <Copy size={14} color="#22C986" strokeWidth={2.5} />
          <Text className="text-xs font-bold text-primary">Copy</Text>
        </Pressable>
        <ChevronRight size={18} color="#7d93a5" strokeWidth={2.4} />
      </View>
    </Pressable>
  );
}

function SectionTitle({
  title,
  Icon,
  accent = "#22C986",
}: {
  title: string;
  Icon: LucideIcon;
  accent?: string;
}) {
  return (
    <View className="mb-1.5 flex-row items-center justify-between">
      <Text className="text-lg font-bold text-white">{title}</Text>
      <View className="items-center justify-center border rounded-md h-9 w-9 border-border bg-secondary">
        <Icon size={18} color={accent} strokeWidth={2.4} />
      </View>
    </View>
  );
}

function MenuRow({
  title,
  description,
  Icon,
  isActive,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
  isActive?: boolean;
}) {
  const StatusIcon = isActive ? CircleCheck : CircleX;

  return (
    <Pressable className="flex-row items-center gap-3 py-2.5 active:opacity-70">
      <View className="items-center justify-center border rounded-md h-9 w-9 border-border bg-secondary">
        <Icon size={18} color="#22C986" strokeWidth={2.3} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{title}</Text>
        <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
          {description}
        </Text>
      </View>
      {typeof isActive === "boolean" ? (
        <View
          className={`flex-row items-center gap-1 rounded-md border px-2 py-1 ${
            isActive
              ? "border-primary/30 bg-primary/10"
              : "border-border bg-secondary"
          }`}
        >
          <StatusIcon
            size={13}
            color={isActive ? "#22C986" : "#7d93a5"}
            strokeWidth={2.6}
          />
          <Text
            className={`text-[10px] font-bold ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isActive ? "ON" : "OFF"}
          </Text>
        </View>
      ) : null}
      <ChevronRight size={19} color="#7d93a5" strokeWidth={2.4} />
    </Pressable>
  );
}

function AppVersionRow() {
  return (
    <View className="flex-row items-center gap-3 py-2.5">
      <View className="items-center justify-center border rounded-md h-9 w-9 border-border bg-secondary">
        <Settings size={18} color="#22C986" strokeWidth={2.3} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">App Version</Text>
        <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
          Current installed build
        </Text>
      </View>
      <Text className="text-xs font-bold text-muted-foreground">
        {appVersion}
      </Text>
    </View>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const toast = useToast();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCopyReferralCode = useCallback(async () => {
    await Clipboard.setStringAsync(referralCode);
    toast.info("Referral code copied", referralCode);
  }, [toast]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
      toast.error("Logout failed", "Please try again.");
    }
  }, [isLoggingOut, logout, toast]);

  return (
    <SafeAreaView className="flex-1 bg-[#0B2D22]" edges={["top"]}>
      <ScrollView
        alwaysBounceVertical
        className="flex-1 bg-background/90"
        contentContainerStyle={{ paddingBottom: 128 }}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-b-3xl border-b border-primary/20 bg-[#0B2D22]">
          <View className="px-5 pt-4 pb-12">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold uppercase text-white/85">
                Profile
              </Text>
              <NotificationButton count={notificationCount} />
            </View>
            <View className="items-center mt-6">
              <View className="h-[72px] w-[72px] items-center justify-center rounded-2xl border border-border bg-secondary">
                <UserRound size={34} color="#22C986" strokeWidth={2.2} />
              </View>
              <Text className="mt-3 text-xl font-bold text-white">Account</Text>
              <Text className="mt-1 text-xs leading-4 text-center text-white/80">
                Manage security, notification, gas balance, and trading access.
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className="px-5 -mt-8 active:opacity-80"
          onPress={() => router.push("/leaderboard")}
        >
          <View className="p-3 border rounded-2xl border-border bg-card">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold uppercase text-muted-foreground">
                Profit
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-primary">View</Text>
                <ChevronRight size={14} color="#22C986" strokeWidth={2.5} />
              </View>
            </View>
            <View className="flex-row gap-2.5">
              {profileProfitSummary.map((item) => (
                <View
                  key={item.label}
                  className="flex-1 items-center rounded-lg border border-border bg-secondary px-2 py-2.5"
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
        </Pressable>

        <View className="px-5 mt-5">
          <SectionTitle Icon={Flame} title="Gas & Wallet" />

          <View className="px-4 py-2 border rounded-2xl border-border bg-card">
            <BalanceRow
              Icon={Gauge}
              actionLabel="Deposit Gas"
              subtitle={`Used ${formatNumber(gasResponse.gas.used_gas)}`}
              title="Gas"
              value={formatNumber(gasResponse.gas.gas)}
            />
            <View className="h-px bg-border/70" />
            <BalanceRow
              Icon={Wallet}
              actionLabel="Withdraw"
              subtitle={`Locked ${formatNumber(gasResponse.wallet.locked)}`}
              title="Wallet"
              value={formatNumber(gasResponse.wallet.credit)}
            />
          </View>
        </View>

        <View className="px-5 mt-5">
          <SectionTitle
            Icon={Settings}
            accent="#F59E0B"
            title="User Settings"
          />
          <View className="px-4 py-2 border rounded-2xl border-border bg-card">
            <PushNotificationRow enabled={pushNotificationsEnabled} />
            <View className="h-px bg-border/70" />
            <MenuRow {...telegramSetting} />
            <View className="h-px bg-border/70" />
            <ReferralRow
              onCopy={handleCopyReferralCode}
              onPress={() => router.push("/leaderboard")}
            />
            <View className="h-px bg-border/70" />
            <MenuRow
              Icon={KeyRound}
              description="Trading API credentials and permissions"
              title="API Key"
            />
            <View className="h-px bg-border/70" />
            <MenuRow
              Icon={FileText}
              description="Data use, terms, and account policy"
              title="Privacy Policy"
            />
            <View className="h-px bg-border/70" />
            <AppVersionRow />
          </View>
        </View>

        <View className="px-5 mt-5">
          <SectionTitle Icon={ShieldCheck} title="Security" />
          <View className="px-4 py-2 border rounded-2xl border-border bg-card">
            {securityMenus.map((item, index) => (
              <View key={item.title}>
                <MenuRow {...item} />
                {index < securityMenus.length - 1 ? (
                  <View className="h-px bg-border/70" />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View className="px-5 mt-5">
          <Pressable
            className={`flex-row items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 active:opacity-70 ${
              isLoggingOut ? "opacity-60" : ""
            }`}
            disabled={isLoggingOut}
            onPress={handleLogout}
          >
            <View className="items-center justify-center border rounded-md h-9 w-9 border-red-500/25 bg-red-500/10">
              <LogOut size={18} color="#F87171" strokeWidth={2.4} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-red-300">
                {isLoggingOut ? "Logging out" : "Logout"}
              </Text>
              <Text className="mt-0.5 text-xs text-red-200/70">
                Sign out from this device
              </Text>
            </View>
            {isLoggingOut ? (
              <ActivityIndicator color="#F87171" size="small" />
            ) : (
              <ChevronRight size={19} color="#F87171" strokeWidth={2.4} />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
