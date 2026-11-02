import { useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import AuthField from "@/components/landing/AuthField";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";
import {
  saveDeviceCredential,
  removeDeviceCredential,
} from "@/services/managedDeviceCredential";
const ManagedDeviceSetup = ({ disabled }: { disabled: boolean }) => {
  const palette = useAdminSurfacePalette();
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const locked = useRef(false);
  if (Platform.OS === "web") return null;
  const change = async (remove: boolean) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setMessage(null);
    try {
      if (remove) await removeDeviceCredential();
      else await saveDeviceCredential(value);
      setValue("");
      setMessage(
        remove
          ? "Device credential removed. Ask the administrator to revoke it too."
          : "Device credential saved securely. Sign in with the resident's email and password.",
      );
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save the device credential. Try again.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };
  return (
    <View className="gap-3 pb-4">
      <DashboardButton
        palette={palette}
        label={expanded ? "Close device setup" : "Device setup"}
        onPress={() => setExpanded(!expanded)}
        disabled={disabled || busy}
      />
      {expanded ? (
        <>
          <Text style={[TYPE.body, { color: palette.body }]}>
            A credential is optional. If the administrator gave you one for this
            device, save it here and it is used for future sign-ins.
          </Text>
          <AuthField
            label="Device credential"
            value={value}
            onChangeText={setValue}
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
            placeholder="Paste the device credential"
            maxLength={89}
            disabled={disabled || busy}
          />
          <DashboardButton
            palette={palette}
            label="Save device credential"
            onPress={() => void change(false)}
            loading={busy}
            disabled={disabled || !value.trim()}
          />
          <DashboardButton
            palette={palette}
            label="Remove saved credential"
            onPress={() => void change(true)}
            disabled={disabled || busy}
          />
        </>
      ) : null}
      {message ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[TYPE.body, { color: palette.body }]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};
export default ManagedDeviceSetup;
