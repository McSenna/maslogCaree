import React from "react";
import { Text, View } from "react-native";
import { useNotificationPalette } from "../notification.theme";

const NotificationGroupHeader = ({ label }: { label: string }) => {
  const palette = useNotificationPalette();

  return (
    <View
      accessibilityRole="header"
      style={{
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 8,
        backgroundColor: "transparent",
      }}
    >
      <Text
        maxFontSizeMultiplier={1.3}
        style={{
          fontSize: 12.5,
          fontWeight: "600",
          letterSpacing: 0.2,
          color: palette.muted,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default React.memo(NotificationGroupHeader);
