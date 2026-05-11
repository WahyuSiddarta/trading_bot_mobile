import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAutoPilotEnabled, setIsAutoPilotEnabled] = useState(true);
  const [isDiagnosticsEnabled, setIsDiagnosticsEnabled] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [drawerAnimation, isDrawerOpen]);

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-320, 0],
  });

  const backdropOpacity = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.heroCard}>
          <ThemedText style={styles.eyebrow}>CONTROL SURFACE</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Local drawer for tools, filters, or custom actions.
          </ThemedText>
          <ThemedText style={styles.description}>
            This drawer is just UI state. It does not change routes, so you can
            mount any component tree inside it.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDrawerOpen(true)}
            className="bg-primary rounded-full px-4 py-2"
          >
            <ThemedText>Open Drawer 1r</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.panelRow}>
          <ThemedView style={styles.infoCard}>
            <ThemedText type="subtitle">Why this approach</ThemedText>
            <ThemedText style={styles.cardText}>
              Use a drawer when you need a persistent side panel for controls,
              not another navigator.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoCard}>
            <ThemedText type="subtitle">Good use cases</ThemedText>
            <ThemedText style={styles.cardText}>
              Bot settings, environment switches, profile tools, queued jobs, or
              quick actions.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <Animated.View
        pointerEvents={isDrawerOpen ? "auto" : "none"}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setIsDrawerOpen(false)}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerTranslateX }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <View>
            <ThemedText style={styles.drawerLabel}>BOT DRAWER</ThemedText>
            <ThemedText type="subtitle">Robot Controls</ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDrawerOpen(false)}
            style={styles.closeButton}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </Pressable>
        </View>

        <ThemedView style={styles.drawerCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <ThemedText type="defaultSemiBold">Auto pilot</ThemedText>
              <ThemedText style={styles.settingHint}>
                Keep the bot running background routines.
              </ThemedText>
            </View>
            <Switch
              trackColor={{ false: "#233041", true: "#22C986" }}
              thumbColor={isAutoPilotEnabled ? "#07111f" : "#d4d8dd"}
              value={isAutoPilotEnabled}
              onValueChange={setIsAutoPilotEnabled}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <ThemedText type="defaultSemiBold">Diagnostics mode</ThemedText>
              <ThemedText style={styles.settingHint}>
                Expose logs, metrics, and event traces in the panel.
              </ThemedText>
            </View>
            <Switch
              trackColor={{ false: "#233041", true: "#22C986" }}
              thumbColor={isDiagnosticsEnabled ? "#07111f" : "#d4d8dd"}
              value={isDiagnosticsEnabled}
              onValueChange={setIsDiagnosticsEnabled}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.drawerCard}>
          <ThemedText type="defaultSemiBold">Quick actions</ThemedText>
          <View style={styles.actionList}>
            <Pressable style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>
                Run Sync
              </ThemedText>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>
                Queue Mission
              </ThemedText>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>
                Export Logs
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#02060c",
  },
  content: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 140,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#17314d",
    padding: 24,
    backgroundColor: "#07111f",
    shadowColor: "#22C986",
    shadowOpacity: 0.15,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  eyebrow: {
    color: "#22C986",
    fontSize: 12,
    letterSpacing: 1.8,
    marginBottom: 12,
  },
  title: {
    lineHeight: 40,
    marginBottom: 12,
  },
  description: {
    color: "#9fb3c8",
    marginBottom: 24,
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#22C986",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#021106",
    fontWeight: "700",
  },
  panelRow: {
    gap: 16,
  },
  infoCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#13253a",
    backgroundColor: "#08111d",
    padding: 20,
    gap: 10,
  },
  cardText: {
    color: "#95a8bc",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 320,
    paddingTop: 72,
    paddingHorizontal: 18,
    paddingBottom: 24,
    backgroundColor: "#050b14",
    borderRightWidth: 1,
    borderRightColor: "#17314d",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  drawerLabel: {
    color: "#22C986",
    fontSize: 12,
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  closeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#234362",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: "#d9e6f2",
    fontWeight: "600",
  },
  drawerCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#13253a",
    backgroundColor: "#08111d",
    padding: 16,
    gap: 16,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  settingCopy: {
    flex: 1,
    gap: 4,
  },
  settingHint: {
    color: "#8ca0b5",
    fontSize: 14,
    lineHeight: 20,
  },
  actionList: {
    gap: 10,
  },
  secondaryButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#234362",
    backgroundColor: "#0b1727",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#d9e6f2",
    fontWeight: "600",
  },
  drawerSpacer: {
    position: "absolute",
  },
});
