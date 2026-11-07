import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";
import { useNotificationPalette } from "../../notification.theme";

const NotificationPanelFooter = ({ onPress }: { onPress: () => void }) => {
  const palette = useNotificationPalette();

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
      <StatePressable
        accessibilityRole="button"
        accessibilityLabel="View all notifications"
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingVertical: 12,
          backgroundColor: pressed ? palette.divider : "transparent",
        })}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: palette.primary }}>
          View all notifications
        </Text>
        <Feather name="arrow-right" size={13} color={palette.primary} />
      </StatePressable>
    </View>
  );
};

export default React.memo(NotificationPanelFooter);
