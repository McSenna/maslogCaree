import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatTicketDateTime } from "../../utils/support.utils";
import type { SupportMessage } from "../../types/support.types";

type AdminSupportConversationProps = {
  messages: SupportMessage[];
};

const AdminSupportConversation = ({ messages }: AdminSupportConversationProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle, letterSpacing: 0.4, textTransform: "uppercase" }}>
          Response History ({messages.length})
        </Text>
      </View>

      {messages.length === 0 ? (
        <View
          style={{
            padding: 16,
            borderRadius: RADIUS.panel,
            backgroundColor: palette.subtleSurface,
            borderWidth: 1,
            borderColor: palette.cardBorder,
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Feather name="message-square" size={18} color={palette.muted} />
          <Text style={{ fontSize: 13, color: palette.muted, textAlign: "center" }}>
            No replies recorded yet. Write a response below to update the requester.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          {messages.map((message) => {
            const isStaff = message.isStaffReply;
            return (
              <View
                key={message.id}
                style={{
                  padding: 14,
                  borderRadius: RADIUS.panel,
                  backgroundColor: isStaff
                    ? palette.isDark
                      ? "rgba(2, 132, 199, 0.08)"
                      : "#F0F9FF"
                    : palette.cardBg,
                  borderWidth: 1,
                  borderColor: isStaff
                    ? palette.isDark
                      ? "rgba(56, 189, 248, 0.25)"
                      : "#BAE6FD"
                    : palette.cardBorder,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: RADIUS.pill,
                        backgroundColor: isStaff
                          ? palette.isDark
                            ? "rgba(2, 132, 199, 0.25)"
                            : "#E0F2FE"
                          : palette.isDark
                            ? "rgba(148, 163, 184, 0.2)"
                            : "#F1F5F9",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: isStaff
                            ? palette.isDark
                              ? "#38BDF8"
                              : "#0284C7"
                            : palette.muted,
                        }}
                      >
                        {isStaff ? "MaslogCare Support" : message.authorRole || "Requester"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12.5, fontWeight: "600", color: palette.heading }}>
                      {message.authorName}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 11.5, color: palette.muted, fontVariant: ["tabular-nums"] }}>
                    {formatTicketDateTime(message.createdAt)}
                  </Text>
                </View>

                <Text style={{ fontSize: 13.5, lineHeight: 21, color: palette.body }}>
                  {message.body}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default AdminSupportConversation;
