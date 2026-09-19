import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminTicketStatusBadge from "./AdminTicketStatusBadge";
import { SUPPORT_TABLE_COLUMNS } from "./adminSupportTableColumns";
import { formatTicketDate, supportCategoryLabel } from "../utils/support.utils";
import type { SupportTicketSummary } from "../types/support.types";

type AdminSupportTableRowProps = {
  ticket: SupportTicketSummary;
  isLast: boolean;
  onReview: () => void;
};

const AdminSupportTableRow = ({ ticket, isLast, onReview }: AdminSupportTableRowProps) => {
  const palette = useAdminSurfacePalette();
  const [isHovered, setIsHovered] = useState(false);
  const cols = SUPPORT_TABLE_COLUMNS;

  return (
    <View
      className="relative w-full flex-row items-center"
      style={{
        width: "100%",
        minHeight: 64,
        paddingVertical: 8,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
        backgroundColor: isHovered ? palette.subtleSurface : "transparent",
      }}
    >
      <Pressable
        onPress={onReview}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`View support ticket ${ticket.ticketNumber}`}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
      />

      <View pointerEvents="box-none" style={{ width: cols.ticket.width, minWidth: cols.ticket.minWidth, paddingHorizontal: 12, zIndex: 1 }}>
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: RADIUS.control,
            backgroundColor: palette.isDark ? "rgba(99, 102, 241, 0.12)" : "#F1F5F9",
            borderWidth: 1,
            borderColor: palette.isDark ? "rgba(99, 102, 241, 0.25)" : "#E2E8F0",
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "700", color: palette.isDark ? "#A5B4FC" : "#334155", fontVariant: ["tabular-nums"] }}>
            {ticket.ticketNumber}
          </Text>
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={{ flex: cols.requester.flex, minWidth: cols.requester.minWidth, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, zIndex: 1 }}
      >
        <UserAvatar size={32} initials={initialsFrom(ticket.requesterName)} accessibilityLabel={`${ticket.requesterName} avatar`} fallbackBackgroundColor={palette.primary} />
        <Text numberOfLines={1} style={{ fontSize: 13.5, fontWeight: "600", color: palette.heading, flexShrink: 1 }}>
          {ticket.requesterName}
        </Text>
      </View>

      <View pointerEvents="box-none" style={{ flex: cols.subject.flex, minWidth: cols.subject.minWidth, paddingHorizontal: 12, zIndex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: "500", color: palette.heading }}>
          {ticket.subject}
        </Text>
      </View>

      <View pointerEvents="box-none" style={{ width: cols.category.width, minWidth: cols.category.minWidth, paddingHorizontal: 12, zIndex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 12.5, color: palette.body }}>
          {supportCategoryLabel(ticket.category)}
        </Text>
      </View>

      <View pointerEvents="box-none" style={{ width: cols.submitted.width, minWidth: cols.submitted.minWidth, paddingHorizontal: 12, zIndex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 12, color: palette.muted, fontVariant: ["tabular-nums"] }}>
          {formatTicketDate(ticket.createdAt)}
        </Text>
      </View>

      <View pointerEvents="box-none" style={{ width: cols.updated.width, minWidth: cols.updated.minWidth, paddingHorizontal: 12, zIndex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 12, color: palette.muted, fontVariant: ["tabular-nums"] }}>
          {formatTicketDate(ticket.lastActivityAt ?? ticket.updatedAt)}
        </Text>
      </View>

      <View pointerEvents="box-none" style={{ width: cols.status.width, minWidth: cols.status.minWidth, paddingHorizontal: 12, alignItems: "center", zIndex: 1 }}>
        <AdminTicketStatusBadge status={ticket.status} />
      </View>

      <View pointerEvents="box-none" style={{ width: cols.actions.width, minWidth: cols.actions.minWidth, paddingHorizontal: 12, alignItems: "flex-end", zIndex: 2 }}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onReview();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Review ticket ${ticket.ticketNumber}`}
          style={({ hovered, pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: RADIUS.control,
            backgroundColor: hovered ? palette.primary : palette.cardBg,
            borderWidth: 1,
            borderColor: hovered ? palette.primary : palette.cardBorder,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          {({ hovered }) => (
            <>
              <Feather name="eye" size={13} color={hovered ? "#FFFFFF" : palette.heading} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: hovered ? "#FFFFFF" : palette.heading }}>
                Review
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default AdminSupportTableRow;
