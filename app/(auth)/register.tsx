import { Link, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuthStore } from "@/stores/auth-store";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const onRegister = () => {
    register();
    router.replace("/");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CREATE ACCOUNT</Text>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.description}>
          All app routes are protected. Create your account to continue.
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#6f8599"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6f8599"
          style={styles.input}
          secureTextEntry
        />

        <Pressable onPress={onRegister} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Register</Text>
        </Pressable>

        <View style={styles.inlineRow}>
          <Text style={styles.secondaryText}>Already have an account?</Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.linkText}>Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#02060c",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#17314d",
    backgroundColor: "#07111f",
    padding: 20,
    gap: 12,
  },
  eyebrow: {
    color: "#22C986",
    letterSpacing: 1.6,
    fontSize: 12,
  },
  title: {
    lineHeight: 36,
  },
  description: {
    color: "#9fb3c8",
    marginBottom: 6,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#234362",
    backgroundColor: "#0b1727",
    color: "#e5fff0",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#22C986",
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#021106",
    fontWeight: "700",
  },
  inlineRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  secondaryText: {
    color: "#9fb3c8",
  },
  linkText: {
    color: "#22C986",
    fontWeight: "600",
  },
});
