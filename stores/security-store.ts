import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const BIOMETRIC_UNLOCK_KEY = "biometric_unlock_enabled";

type SecurityState = {
  biometricUnlockEnabled: boolean;
  isLoadingSecurity: boolean;
  clearSecuritySettings: () => Promise<void>;
  hydrateSecurity: () => Promise<void>;
  setBiometricUnlockEnabled: (enabled: boolean) => Promise<void>;
};

export const useSecurityStore = create<SecurityState>((set) => ({
  biometricUnlockEnabled: false,
  isLoadingSecurity: true,
  clearSecuritySettings: async () => {
    await SecureStore.deleteItemAsync(BIOMETRIC_UNLOCK_KEY);

    set({ biometricUnlockEnabled: false });
  },
  hydrateSecurity: async () => {
    try {
      const storedValue = await SecureStore.getItemAsync(BIOMETRIC_UNLOCK_KEY);

      set({
        biometricUnlockEnabled: storedValue === "true",
        isLoadingSecurity: false,
      });
    } catch (error) {
      set({
        biometricUnlockEnabled: false,
        isLoadingSecurity: false,
      });
    }
  },
  setBiometricUnlockEnabled: async (enabled) => {
    if (enabled) {
      await SecureStore.setItemAsync(BIOMETRIC_UNLOCK_KEY, "true");
    } else {
      await SecureStore.deleteItemAsync(BIOMETRIC_UNLOCK_KEY);
    }

    set({ biometricUnlockEnabled: enabled });
  },
}));
