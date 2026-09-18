import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";

const COPY: Record<NotificationFilter, { title: string; message: string; icon: keyof typeof Feather.glyphMap; isSuccess?: boolean }> = {
  all: {
    title: "You're all caught up",
    message:
      "No notifications yet. Updates about your appointments and healthcare services will appear here.",
    icon: "bell",
  },
  unread: {
    title: "All caught up",
    message: "You have no unread notifications.",
    icon: "check-circle",
    isSuccess: true,
  },
};

const NotificationEmptyState = ({ filter = "all" }: { filter?: NotificationFilter }) => {
  const palette = useNotificationPalette();
  const { title, message, icon, isSuccess } = COPY[filter];
  const bg = isSuccess ? palette.successSoft : palette.primarySoft;
  const fg = isSuccess ? palette.success : palette.primary;

  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 56 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          marginBottom: 14,
        }}
      >
        <Feather name={icon} size={22} color={fg} />
      </View>

      <Text style={{ fontSize: 15, fontWeight: "700", color: palette.heading }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          maxWidth: 300,
          textAlign: "center",
          fontSize: 13,
          lineHeight: 19,
          color: palette.muted,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default React.memo(NotificationEmptyState);
