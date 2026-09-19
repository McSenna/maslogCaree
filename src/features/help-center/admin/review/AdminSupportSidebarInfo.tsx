import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminTicketStatusBadge from "../AdminTicketStatusBadge";
import { SUPPORT_STATUS_LABELS, SUPPORT_STATUS_ORDER } from "../../constants/support.constants";
import { formatTicketDateTime, supportCategoryLabel } from "../../utils/support.utils";
import type { SupportStatus, SupportTicket } from "../../types/support.types";

type AdminSupportSidebarInfoProps = {
  ticket: SupportTicket;
  busy: boolean;
  onStatusChange: (status: SupportStatus) => void;
};

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: keyof typeof Feather.glyphMap }) => {
  const palette = useAdminSurfacePalette();
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Feather name={icon} size={12} color={palette.muted} />
        <Text style={{ fontSize: 11, fontWeight: "700", color: palette.subtle, letterSpacing: 0.3, textTransform: "uppercase" }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 13, color: palette.body, paddingLeft: 18 }}>{value || "—"}</Text>
    </View>
  );
};

const AdminSupportSidebarInfo = ({ ticket, busy, onStatusChange }: AdminSupportSidebarInfoProps) => {
  const palette = useAdminSurfacePalette();
  const cardStyle = {
    padding: 14,
    borderRadius: RADIUS.panel,
    backgroundColor: palette.subtleSurface,
    borderWidth: 1,
    borderColor: palette.cardBorder,
    gap: 10,
  };
  const sectionTitleStyle = {
    fontSize: 11.5,
    fontWeight: "700" as const,
    color: palette.subtle,
    letterSpacing: 0.4,
    textTransform: "uppercase" as const,
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={{ ...cardStyle, gap: 12 }}>
        <Text style={sectionTitleStyle}>Requester Information</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <UserAvatar
            size={38}
            initials={initialsFrom(ticket.requesterName)}
            accessibilityLabel={`${ticket.requesterName} avatar`}
            fallbackBackgroundColor={palette.primary}
          />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "700", color: palette.heading }}>
              {ticket.requesterName}
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 11.5, color: palette.muted }}>
              {ticket.requesterRole || "Resident"}
            </Text>
          </View>
        </View>
        <View style={{ gap: 10, paddingTop: 4 }}>
          <InfoRow label="Email" value={ticket.contactEmail} icon="mail" />
          <InfoRow label="Contact Number" value={ticket.contactNumber} icon="phone" />
        </View>
      </View>

      <View style={cardStyle}>
        <Text style={sectionTitleStyle}>Ticket Metadata</Text>
        <InfoRow label="Category" value={supportCategoryLabel(ticket.category)} icon="tag" />
        <InfoRow label="Submitted" value={formatTicketDateTime(ticket.createdAt)} icon="calendar" />
        <InfoRow label="Last Activity" value={formatTicketDateTime(ticket.lastActivityAt ?? ticket.updatedAt)} icon="clock" />
      </View>

      <View style={cardStyle}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={sectionTitleStyle}>Status</Text>
          <AdminTicketStatusBadge status={ticket.status} />
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingTop: 4 }}>
          {SUPPORT_STATUS_ORDER.map((status) => {
            const active = status === ticket.status;
            return (
              <Pressable
                key={status}
                onPress={() => onStatusChange(status)}
                disabled={busy || active}
                accessibilityRole="button"
                accessibilityLabel={`Set status to ${SUPPORT_STATUS_LABELS[status]}`}
                style={({ hovered }) => ({
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: RADIUS.pill,
                  backgroundColor: active ? palette.primary : hovered ? palette.cardBg : "transparent",
                  borderWidth: 1,
                  borderColor: active ? palette.primary : palette.cardBorder,
                  opacity: busy && !active ? 0.5 : 1,
                })}
              >
                <Text style={{ fontSize: 11.5, fontWeight: active ? "700" : "500", color: active ? "#FFFFFF" : palette.body }}>
                  {SUPPORT_STATUS_LABELS[status]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default AdminSupportSidebarInfo;
