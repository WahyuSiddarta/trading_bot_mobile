import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CircleAlert,
  X,
} from "lucide-react-native";
import { useCallback, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

const alertColors = {
  dangerForeground: Colors.dark.dangerForeground,
  warning: Colors.dark.warning,
  warningForeground: Colors.dark.warningForeground,
};

type EngineAlert = {
  ip: string;
  symbol: string;
  user_id: string;
};

type GeneralAlert = {
  alert_type: number;
  message: string;
  user_id: string;
};

type AlertResponse = {
  code: string;
  elapsed: number;
  engine_alert: EngineAlert[];
  general_alert: GeneralAlert[];
  status: string;
  version: string;
};

const alertResponse: AlertResponse = {
  code: "ALERT_RETRIEVED",
  elapsed: 0.123,
  engine_alert: [],
  general_alert: [],
  status: "OK",
  version: "v1.0.0",
};
// const alertResponse: AlertResponse = {
//   code: "ALERT_RETRIEVED",
//   elapsed: 0.123,
//   engine_alert: [
//     {
//       ip: "203.0.113.10",
//       symbol: "BTCUSDT",
//       user_id: "1d4f2cf6-68af-4c3f-9c8d-71d2e6a45b19",
//     },
//   ],
//   general_alert: [
//     {
//       alert_type: 1,
//       message: "Operation completed successfully",
//       user_id: "1d4f2cf6-68af-4c3f-9c8d-71d2e6a45b19",
//     },
//   ],
//   status: "OK",
//   version: "v1.0.0",
// };

export function PrivateAlertStrip() {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetSnapPoints = useMemo(() => ["42%", "72%"], []);
  const engineAlerts = alertResponse.engine_alert;
  const alertCount =
    alertResponse.engine_alert.length + alertResponse.general_alert.length;
  const generalSummary = useMemo(
    () =>
      alertResponse.general_alert
        .map((alert) => alert.message)
        .filter(Boolean)
        .join(" • "),
    [],
  );
  const handleOpenAlertTray = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseAlertTray = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.58}
        pressBehavior="close"
      />
    ),
    [],
  );

  if (engineAlerts.length === 0 && alertResponse.general_alert.length === 0) {
    return null;
  }

  return (
    <>
      <View style={{ paddingTop: insets.top }}>
        {engineAlerts.length > 0 && (
          <View className="px-4 py-3 border-b border-destructive/25 bg-destructive-surface">
            <View className="flex-row items-center gap-3">
              <View className="items-center justify-center rounded-full h-9 w-9 bg-destructive/15">
                <AlertTriangle
                  size={19}
                  color={alertColors.dangerForeground}
                  strokeWidth={2.6}
                />
              </View>

              <View className="flex-1 min-w-0">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-sm font-extrabold text-white uppercase shrink"
                    numberOfLines={1}
                  >
                    Critical engine alert
                  </Text>
                </View>
                <Text
                  className="mt-0.5 text-xs font-semibold text-white/90"
                  numberOfLines={1}
                >
                  Whitelist these IPs to use your engine
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                className="px-3 py-2 rounded-full bg-destructive-foreground active:opacity-80"
              >
                <Text className="text-xs font-extrabold text-[#3A0B18]">
                  Fix me
                </Text>
              </Pressable>
            </View>

            <View className="mt-2 gap-1.5">
              {engineAlerts.map((alert) => (
                <View
                  className="flex-row items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-2.5 py-1.5"
                  key={`${alert.symbol}-${alert.ip}`}
                >
                  <View className="h-1.5 w-1.5 rounded-full bg-destructive-foreground" />
                  <Text
                    className="min-w-0 flex-1 text-[11px] font-extrabold text-white"
                    numberOfLines={1}
                  >
                    {alert.symbol}
                  </Text>
                  <Text
                    className="text-[11px] font-bold text-white/80"
                    numberOfLines={1}
                  >
                    {alert.ip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!generalSummary && (
          <Pressable
            accessibilityRole="button"
            onPress={handleOpenAlertTray}
            className="flex-row items-center gap-2 border-b border-warning/25 bg-warning-surface px-4 py-2.5 active:opacity-90"
          >
            <CircleAlert
              size={15}
              color={alertColors.warning}
              strokeWidth={2.4}
            />
            <Text
              className="flex-1 min-w-0 text-xs font-bold"
              numberOfLines={1}
              style={{ color: alertColors.warningForeground }}
            >
              General alerts ({alertResponse.general_alert.length}):{" "}
              {generalSummary}
            </Text>
            <View className="flex-row items-center gap-1 px-2 py-1 border rounded-full border-warning/30 bg-warning/10">
              <Bell size={12} color={alertColors.warning} strokeWidth={2.4} />
              <Text
                className="text-[10px] font-extrabold"
                style={{ color: alertColors.warningForeground }}
              >
                {alertCount}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      <BottomSheetModal
        backgroundStyle={{ backgroundColor: "#07111F" }}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#64748B" }}
        index={0}
        ref={bottomSheetModalRef}
        snapPoints={bottomSheetSnapPoints}
      >
        <BottomSheetView className="px-5 pt-2 pb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-extrabold text-white">Alerts</Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                Persistent updates that need attention
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleCloseAlertTray}
              className="items-center justify-center rounded-full h-9 w-9 bg-secondary active:opacity-80"
            >
              <X size={18} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
          </View>

          {alertResponse.engine_alert.map((alert) => (
            <View
              className="flex-row items-center gap-3 p-4 mb-3 border rounded-2xl border-destructive/25 bg-destructive-surface"
              key={`${alert.symbol}-${alert.ip}`}
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-destructive/15">
                <AlertTriangle
                  size={20}
                  color={alertColors.dangerForeground}
                  strokeWidth={2.5}
                />
              </View>
              <View className="flex-1 min-w-0">
                <Text
                  className="text-sm font-bold text-destructive-foreground"
                  numberOfLines={1}
                >
                  Critical engine alert
                </Text>
                <Text
                  className="mt-1 text-xs leading-5 text-destructive-foreground/75"
                  numberOfLines={2}
                >
                  Whitelist {alert.ip} for {alert.symbol}.
                </Text>
              </View>
              <ChevronRight size={17} color={alertColors.dangerForeground} />
            </View>
          ))}

          {alertResponse.general_alert.map((alert) => (
            <View
              className="flex-row items-center gap-3 p-4 mb-3 border rounded-2xl border-warning/25 bg-warning-surface"
              key={`${alert.alert_type}-${alert.message}`}
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-warning/15">
                <CircleAlert
                  size={20}
                  color={alertColors.warning}
                  strokeWidth={2.5}
                />
              </View>
              <View className="flex-1 min-w-0">
                <Text
                  className="text-sm font-bold"
                  numberOfLines={1}
                  style={{ color: alertColors.warningForeground }}
                >
                  General alert
                </Text>
                <Text
                  className="mt-1 text-xs leading-5"
                  numberOfLines={2}
                  style={{
                    color: alertColors.warningForeground,
                    opacity: 0.75,
                  }}
                >
                  {alert.message}
                </Text>
              </View>
              <ChevronRight size={17} color={alertColors.warningForeground} />
            </View>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
