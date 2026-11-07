import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";

const NotificationErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const palette = useNotificationPalette();

  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 44 }}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.dangerSoft,
          marginBottom: 14,
        }}
      >
        <Feather name="wifi-off" size={20} color={palette.danger} />
      </View>

      <Text style={{ fontSize: 17, fontWeight: "700", color: palette.heading }}>
        Unable to load notifications
      </Text>

      <Text
        style={{
          marginTop: 6,
          maxWidth: 300,
          textAlign: "center",
          fontSize: 15,
          lineHeight: 21,
          color: palette.muted,
        }}
      >
        Please check your connection and try again.
      </Text>

      <StatePressable
        accessibilityRole="button"
        accessibilityLabel="Try loading notifications again"
        onPress={onRetry}
        style={({ pressed }) => ({
          marginTop: 16,
          paddingHorizontal: 20,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: NOTIFICATION_RADIUS.control,
          backgroundColor: palette.primary,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ fontSize: 15.5, fontWeight: "700", color: palette.onPrimary }}>Try again</Text>
      </StatePressable>
    </View>
  );
};

export default React.memo(NotificationErrorState);
