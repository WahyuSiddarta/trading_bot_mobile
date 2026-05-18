import * as Clipboard from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  BotMessageSquare,
  Copy,
  ExternalLink,
  RefreshCw,
  Timer,
} from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TelegramIcon } from "@/components/icons/telegram-icon";
import { useToast } from "@/components/ui/toast";
import { useTelegramLinkCodeQuery } from "@/hooks/use-query";
import { errorMessages } from "@/utils/error";

const telegramBotUsername = "CrispyTrade_bot";
const telegramBotDeepLink = `tg://resolve?domain=${telegramBotUsername}`;
const telegramBotWebUrl = `https://t.me/${telegramBotUsername}`;

function formatExpiry(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function ProcessStep({
  index,
  title,
  description,
  isLast = false,
}: {
  index: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View className="items-center justify-center w-6 h-6 rounded-md bg-primary">
          <Text className="text-xs font-black text-[#031018]">{index}</Text>
        </View>
        {!isLast ? <View className="w-px h-8 mt-1 bg-border" /> : null}
      </View>
      <View className="flex-1 pb-3">
        <Text className="text-sm font-bold text-white">{title}</Text>
        <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
          {description}
        </Text>
      </View>
    </View>
  );
}

function LoadingTelegramState() {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-border bg-card">
      <ActivityIndicator color="#22C986" size="small" />
      <Text className="mt-4 text-base font-bold text-white">
        Loading link code
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-muted-foreground">
        Preparing your Telegram account connection.
      </Text>
    </View>
  );
}

function ErrorTelegramState({
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
        Failed to load Telegram link
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

export default function TelegramScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data, error, isError, isLoading, isRefetching, refetch } =
    useTelegramLinkCodeQuery();
  const linkCode = data?.telegram_link_code ?? "";
  const expiryText = formatExpiry(data?.telegram_link_expires_at);

  const handleCopyCode = useCallback(async () => {
    if (!linkCode) {
      return;
    }

    await Clipboard.setStringAsync(linkCode);
    toast.info("Telegram link copied", linkCode);
  }, [linkCode, toast]);

  const handleCopyStartCommand = useCallback(async () => {
    await Clipboard.setStringAsync("/start");
    toast.info("Telegram command copied", "/start");
  }, []);

  const handleOpenTelegram = useCallback(async () => {
    const canOpenTelegramApp = await Linking.canOpenURL(telegramBotDeepLink);

    if (canOpenTelegramApp) {
      await Linking.openURL(telegramBotDeepLink);
      return;
    }

    await Linking.openURL(telegramBotWebUrl);
  }, [toast]);

  const handleRefresh = useCallback(() => {
    refetch().then((result) => {
      if (result.isSuccess) {
        toast.success("Telegram link refreshed");
      }
    });
  }, [refetch, toast]);

  return (
    <SafeAreaView className="flex-1 bg-[#07111F]" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            colors={["#22C986"]}
            progressBackgroundColor="#07111F"
            refreshing={isRefetching}
            tintColor="#22C986"
            onRefresh={handleRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-4 pb-4 border-b border-border/70 bg-background">
          <View className="flex-row items-center gap-3">
            <Pressable
              className="items-center justify-center w-10 h-10 border rounded-md border-border bg-card active:opacity-70"
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-lg font-black text-white">Telegram</Text>
              <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
                Account notification setup
              </Text>
            </View>
            <View className="items-center justify-center w-10 h-10 border rounded-md border-border bg-card">
              <TelegramIcon color="#38BDF8" size={20} />
            </View>
          </View>
        </View>

        <View className="gap-3 px-5 pt-4">
          {isLoading ? (
            <LoadingTelegramState />
          ) : isError ? (
            <ErrorTelegramState
              isRefetching={isRefetching}
              message={errorMessages(error)}
              onRefetch={refetch}
            />
          ) : (
            <>
              <View className="px-4 py-4 border rounded-2xl border-border bg-card">
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <Text className="text-base font-black text-white">
                      Link Telegram Account
                    </Text>
                    <Text className="mt-1 text-xs leading-4 text-muted-foreground">
                      Follow these steps in order to connect your account.
                    </Text>
                  </View>
                  <View className="shrink-0 flex-row items-center gap-1.5 rounded-md border border-primary/25 bg-primary/10 px-2 py-1.5">
                    <Timer size={12} color="#22C986" strokeWidth={2.4} />
                    <Text className="text-[10px] font-bold text-primary">
                      Ready
                    </Text>
                  </View>
                </View>

                <View className="mt-4">
                  <ProcessStep
                    description="Open the trading bot chat in Telegram."
                    index={1}
                    title="Open Telegram bot"
                  />
                  <ProcessStep
                    description="Copy /start and send it to the bot."
                    index={2}
                    title="Send start command"
                  />
                  <ProcessStep
                    description="Copy this code and paste it into Telegram."
                    index={3}
                    title="Paste your link code"
                  />
                  <ProcessStep
                    description="Telegram notifications will be sent after the bot confirms this account."
                    index={4}
                    isLast
                    title="Wait for confirmation"
                  />
                </View>

                <View className="gap-2 mt-1">
                  <Pressable
                    className="flex-row items-center justify-center gap-2 rounded-md bg-[#38BDF8] px-3 py-2.5 active:opacity-80"
                    onPress={handleOpenTelegram}
                  >
                    <ExternalLink size={15} color="#031018" strokeWidth={2.6} />
                    <Text className="text-xs font-extrabold text-[#031018]">
                      Open Telegram Bot
                    </Text>
                  </Pressable>

                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 px-3 py-2 border rounded-lg border-primary/25 bg-primary/10">
                      <Text className="text-sm font-black text-primary">
                        /start
                      </Text>
                    </View>
                    <Pressable
                      className="items-center justify-center w-10 h-10 rounded-lg bg-primary active:opacity-80"
                      onPress={handleCopyStartCommand}
                    >
                      <Copy size={17} color="#031018" strokeWidth={2.6} />
                    </Pressable>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 rounded-lg border border-primary/25 bg-[#061A14] px-3 py-2">
                      <Text className="text-xs font-bold leading-5 text-primary">
                        {linkCode}
                      </Text>
                    </View>
                    <Pressable
                      className="items-center justify-center w-10 h-10 rounded-lg bg-primary active:opacity-80"
                      onPress={handleCopyCode}
                    >
                      <Copy size={17} color="#031018" strokeWidth={2.6} />
                    </Pressable>
                  </View>

                  <View className="flex-row items-center gap-2 rounded-lg border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-3 py-2.5">
                    <BotMessageSquare
                      size={16}
                      color="#F59E0B"
                      strokeWidth={2.4}
                    />
                    <Text className="flex-1 text-xs font-semibold leading-4 text-[#FCD34D]">
                      Keep Telegram installed and do not share this code.
                    </Text>
                  </View>

                  <Text className="text-[11px] font-semibold leading-4 text-muted-foreground">
                    Link expires {expiryText}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
