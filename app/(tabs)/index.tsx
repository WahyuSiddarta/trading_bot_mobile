import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

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
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>CONTROL SURFACE</Text>
          <Text style={styles.title}>
            Local drawer for tools, filters, or custom actions.
          </Text>
          <Text style={styles.description}>
            This drawer is just UI state. It does not change routes, so you can
            mount any component tree inside it.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDrawerOpen(true)}
            className="bg-primary rounded-full px-4 py-2"
          >
            <Text>Open Drawer 1r</Text>
          </Pressable>
        </View>

        <View style={styles.panelRow}>
          <View style={styles.infoCard}>
            <Text>Why this approach</Text>
            <Text style={styles.cardText}>
              Use a drawer when you need a persistent side panel for controls,
              not another navigator.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text>Good use cases</Text>
            <Text style={styles.cardText}>
              Bot settings, environment switches, profile tools, queued jobs, or
              quick actions.
            </Text>
          </View>
        </View>
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
            <Text style={styles.drawerLabel}>BOT DRAWER</Text>
            <Text>Robot Controls</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDrawerOpen(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.drawerCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text>Auto pilot</Text>
              <Text style={styles.settingHint}>
                Keep the bot running background routines.
              </Text>
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
              <Text>Diagnostics mode</Text>
              <Text style={styles.settingHint}>
                Expose logs, metrics, and event traces in the panel.
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#233041", true: "#22C986" }}
              thumbColor={isDiagnosticsEnabled ? "#07111f" : "#d4d8dd"}
              value={isDiagnosticsEnabled}
              onValueChange={setIsDiagnosticsEnabled}
            />
          </View>
        </View>

        <View style={styles.drawerCard}>
          <Text>Quick actions</Text>
          <View style={styles.actionList}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Run Sync</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Queue Mission</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Export Logs</Text>
            </Pressable>
          </View>
        </View>
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
