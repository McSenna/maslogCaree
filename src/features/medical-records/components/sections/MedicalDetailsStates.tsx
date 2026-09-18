import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

export const DetailsLoading = ({ palette }: { palette: ResidentDialogPalette }) => (
  <View
    accessibilityLiveRegion="polite"
    style={{ paddingVertical: 48, alignItems: "center", justifyContent: "center" }}
  >
    <ActivityIndicator size="large" color={palette.accent} />
    <Text style={{ color: palette.muted, marginTop: 14, fontSize: 14, fontWeight: "500" }}>
      Loading medical details...
    </Text>
  </View>
);

export const DetailsError = ({
  palette,
  message,
  onRetry,
}: {
  palette: ResidentDialogPalette;
  message: string;
  onRetry?: () => void;
}) => (
  <View
    accessibilityLiveRegion="polite"
    style={{
      padding: 24,
      borderRadius: 16,
      backgroundColor: palette.dangerSoft,
      borderColor: palette.dangerBorder,
      borderWidth: 1,
      alignItems: "center",
    }}
  >
    <Feather name="alert-circle" size={30} color={palette.danger} />
    <Text style={{ color: palette.dangerFg, fontSize: 16, fontWeight: "600", marginTop: 8 }}>
      Unable to load medical details
    </Text>
    <Text style={{ color: palette.muted, fontSize: 13, textAlign: "center", marginTop: 4 }}>
      {message}
    </Text>
    {onRetry ? (
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={{
          marginTop: 14,
          minHeight: 40,
          justifyContent: "center",
          paddingHorizontal: 18,
          borderRadius: 8,
          backgroundColor: palette.accent,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>Try Again</Text>
      </Pressable>
    ) : null}
  </View>
);

export const DetailsEmpty = ({ palette }: { palette: ResidentDialogPalette }) => (
  <View
    style={{
      padding: 32,
      borderRadius: 16,
      backgroundColor: palette.card,
      borderColor: palette.border,
      borderWidth: 1,
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: palette.accentSoft,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      <Feather name="clipboard" size={24} color={palette.accent} />
    </View>
    <Text style={{ color: palette.heading, fontSize: 16, fontWeight: "600" }}>
      No medical details available yet.
    </Text>
    <Text
      style={{
        color: palette.muted,
        fontSize: 13,
        textAlign: "center",
        marginTop: 6,
        lineHeight: 18,
        maxWidth: 320,
      }}
    >
      Your assessment, vital signs and advice appear here once your health worker files the record
      for this visit.
    </Text>
  </View>
);
