import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNotificationPalette } from "../../notification.theme";

const NotificationPanelFooter = ({ onPress }: { onPress: () => void }) => {
  const palette = useNotificationPalette();

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
      <Pressable
        accessibilityRole="link"
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
        <Text style={{ fontSize: 13, fontWeight: "700", color: palette.primary }}>
          View all notifications
        </Text>
        <Feather name="arrow-right" size={13} color={palette.primary} />
      </Pressable>
    </View>
  );
};

export default React.memo(NotificationPanelFooter);
