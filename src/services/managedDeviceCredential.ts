import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
const KEY = "maslogcare_managed_device";
export const readDeviceCredential = async (): Promise<string | null> => {
  if (Platform.OS === "web") return null;
  return SecureStore.getItemAsync(KEY);
};
export const saveDeviceCredential = async (value: string): Promise<void> => {
  if (Platform.OS === "web")
    throw new Error("Device provisioning is available in the native app only.");
  const credential = value.trim();
  if (!/^[a-f0-9]{24}\.[a-f0-9]{64}$/.test(credential))
    throw new Error(
      "Enter the full device credential provided by the administrator.",
    );
  await SecureStore.setItemAsync(KEY, credential, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};
export const removeDeviceCredential = async (): Promise<void> => {
  if (Platform.OS !== "web") await SecureStore.deleteItemAsync(KEY);
};
