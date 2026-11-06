import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";

const COPY: Record<NotificationFilter, { title: string; message: string }> = {
  all: {
    title: "You're all caught up",
    message:
      "No notifications yet. Updates about your appointments and healthcare services will appear here.",
  },
  unread: {
    title: "No unread notifications",
    message: "New alerts from Maslog Health Center will show up here.",
  },
};

const NotificationEmptyState = ({ filter = "all" }: { filter?: NotificationFilter }) => {
  const palette = useNotificationPalette();
  const { title, message } = COPY[filter];

  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 56 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.neutralSoft,
          marginBottom: 16,
        }}
      >
        <Feather name="bell" size={22} color={palette.body} />
      </View>

      <Text style={{ fontSize: 17, fontWeight: "700", color: palette.heading }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          maxWidth: 300,
          textAlign: "center",
          fontSize: 15,
          lineHeight: 21,
          color: palette.body,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default React.memo(NotificationEmptyState);
