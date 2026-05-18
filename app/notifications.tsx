import { Stack, useRouter } from "expo-router";
import { AlertTriangle, ArrowLeft, Bell, RefreshCw } from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnnouncementHtml } from "@/components/announcement-html";
import { useToast } from "@/components/ui/toast";
import { useAnnouncementsQuery, type Announcement } from "@/hooks/use-query";
import { errorMessages } from "@/utils/error";

function formatAnnouncementDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function LoadingNotificationsState() {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-border bg-card">
      <ActivityIndicator color="#22C986" size="small" />
      <Text className="mt-4 text-base font-bold text-white">
        Loading notifications
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-muted-foreground">
        Fetching the latest announcements for your account.
      </Text>
    </View>
  );
}

function ErrorNotificationsState({
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
        Failed to load notifications
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

function EmptyNotificationsState() {
  return (
    <View className="items-center px-5 py-8 border rounded-2xl border-border bg-card">
      <View className="items-center justify-center w-12 h-12 border rounded-xl border-[#F59E0B]/25 bg-[#F59E0B]/10">
        <Bell size={23} color="#F59E0B" strokeWidth={2.4} />
      </View>
      <Text className="mt-4 text-base font-bold text-white">
        No notifications
      </Text>
      <Text className="mt-1 text-xs leading-5 text-center text-muted-foreground">
        New account announcements will appear here.
      </Text>
    </View>
  );
}

function NotificationCard({ item }: { item: Announcement }) {
  return (
    <View className="px-4 py-4 border rounded-2xl border-border bg-card">
      <View className="flex-row items-start gap-3">
        <View className="items-center justify-center w-10 h-10 border rounded-md border-[#F59E0B]/30 bg-[#F59E0B]/10">
          <Bell size={19} color="#F59E0B" strokeWidth={2.4} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-black text-white">{item.title}</Text>
          <Text className="mt-1 text-[11px] font-semibold text-muted-foreground">
            {formatAnnouncementDate(item.created_at)}
          </Text>
        </View>
      </View>

      <View className="px-3 py-3 mt-3 border rounded-xl border-border/70 bg-secondary/70">
        <AnnouncementHtml content={item.content} />
      </View>
    </View>
  );
}

function NotificationsHeader() {
  const router = useRouter();

  return (
    <View className="px-5 pt-4 pb-4 border-b border-border/70 bg-background">
      <View className="flex-row items-center gap-3">
        <Pressable
          className="items-center justify-center w-10 h-10 border rounded-md border-border bg-card active:opacity-70"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-lg font-black text-white">Notifications</Text>
          <Text className="mt-0.5 text-xs leading-4 text-muted-foreground">
            Announcements and system updates
          </Text>
        </View>
        <View className="items-center justify-center w-10 h-10 border rounded-md border-[#F59E0B]/30 bg-[#F59E0B]/10">
          <Bell size={20} color="#F59E0B" strokeWidth={2.4} />
        </View>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const toast = useToast();
  const { data, error, isError, isLoading, isRefetching, refetch } =
    useAnnouncementsQuery();

  const handleRefresh = useCallback(() => {
    refetch().then((result) => {
      if (result.isSuccess) {
        toast.success("Notifications refreshed");
      }
    });
  }, [refetch, toast]);

  const announcements = data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-[#07111F]" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 40 }}
        data={isLoading || isError ? [] : announcements}
        keyExtractor={(item) => item.announcement_id}
        ListEmptyComponent={
          <View className="px-5 pt-4">
            {isLoading ? (
              <LoadingNotificationsState />
            ) : isError ? (
              <ErrorNotificationsState
                isRefetching={isRefetching}
                message={errorMessages(error)}
                onRefetch={refetch}
              />
            ) : (
              <EmptyNotificationsState />
            )}
          </View>
        }
        ListHeaderComponent={<NotificationsHeader />}
        refreshControl={
          <RefreshControl
            colors={["#22C986"]}
            progressBackgroundColor="#07111F"
            refreshing={isRefetching}
            tintColor="#22C986"
            onRefresh={handleRefresh}
          />
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <NotificationCard item={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
