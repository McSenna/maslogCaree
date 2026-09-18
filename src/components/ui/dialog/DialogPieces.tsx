import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

export const DialogStatus = ({
  palette,
  message,
}: {
  palette: ResidentDialogPalette;
  message: string;
}) => (
  <View style={{ paddingVertical: 40, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size="large" color={palette.accent} />
    <Text style={{ color: palette.muted, marginTop: 12, fontSize: 14 }}>{message}</Text>
  </View>
);

export const DialogError = ({
  palette,
  title,
  message,
  actionLabel,
  onAction,
}: {
  palette: ResidentDialogPalette;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <View
    style={{
      padding: 20,
      borderRadius: 14,
      backgroundColor: palette.dangerSoft,
      borderColor: palette.dangerBorder,
      borderWidth: 1,
      alignItems: "center",
    }}
  >
    <Feather name="alert-circle" size={28} color={palette.danger} />
    <Text style={{ color: palette.dangerFg, fontSize: 15, fontWeight: "600", marginTop: 8 }}>
      {title}
    </Text>
    <Text style={{ color: palette.muted, fontSize: 13, textAlign: "center", marginTop: 4 }}>
      {message}
    </Text>
    <Pressable
      onPress={onAction}
      accessibilityRole="button"
      style={{
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 8,
        backgroundColor: palette.accent,
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>{actionLabel}</Text>
    </Pressable>
  </View>
);

export const InlineError = ({
  palette,
  message,
}: {
  palette: ResidentDialogPalette;
  message: string;
}) => (
  <View
    accessibilityLiveRegion="polite"
    style={{
      padding: 10,
      borderRadius: 8,
      backgroundColor: palette.dangerSoft,
      borderColor: palette.danger,
      borderWidth: 1,
    }}
  >
    <Text style={{ color: palette.dangerFg, fontSize: 12.5, textAlign: "center" }}>{message}</Text>
  </View>
);

export const EmptyNote = ({
  palette,
  message,
}: {
  palette: ResidentDialogPalette;
  message: string;
}) => (
  <View
    style={{
      padding: 16,
      borderRadius: 10,
      backgroundColor: palette.card,
      borderColor: palette.border,
      borderWidth: 1,
      alignItems: "center",
    }}
  >
    <Text style={{ color: palette.muted, fontSize: 13, textAlign: "center" }}>{message}</Text>
  </View>
);

export const DialogActions = ({
  palette,
  secondaryLabel,
  onSecondary,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  busy = false,
  destructive = false,
  icon,
}: {
  palette: ResidentDialogPalette;
  secondaryLabel: string;
  onSecondary: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  busy?: boolean;
  destructive?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}) => {
  const primaryBg = primaryDisabled
    ? palette.disabled
    : destructive
      ? palette.danger
      : palette.accent;

  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
      <Pressable
        onPress={onSecondary}
        disabled={busy}
        accessibilityRole="button"
        style={{
          flex: 1,
          height: 44,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.cardRaised,
          alignItems: "center",
          justifyContent: "center",
          opacity: busy ? 0.55 : 1,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: palette.body }}>
          {secondaryLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={onPrimary}
        disabled={busy || primaryDisabled}
        accessibilityRole="button"
        accessibilityState={{ busy, disabled: busy || primaryDisabled }}
        style={{
          flex: 1.4,
          height: 44,
          borderRadius: 12,
          backgroundColor: primaryBg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: busy ? 0.75 : 1,
        }}
      >
        {busy ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : icon ? (
          <Feather name={icon} size={16} color={primaryDisabled ? palette.muted : "#FFFFFF"} />
        ) : null}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: primaryDisabled && !busy ? palette.muted : "#FFFFFF",
          }}
        >
          {primaryLabel}
        </Text>
      </Pressable>
    </View>
  );
};
