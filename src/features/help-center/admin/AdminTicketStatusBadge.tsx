import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { supportStatusLabel } from "../utils/support.utils";
import type { SupportStatus } from "../types/support.types";

type AdminTicketStatusBadgeProps = {
  status: SupportStatus;
};

const getStatusTone = (status: SupportStatus, isDark: boolean) => {
  switch (status) {
    case "open":
      return {
        bg: isDark ? "rgba(2, 132, 199, 0.16)" : "#E0F2FE",
        border: isDark ? "rgba(56, 189, 248, 0.3)" : "#BAE6FD",
        text: isDark ? "#38BDF8" : "#0284C7",
        dot: "#0284C7",
      };
    case "in_review":
      return {
        bg: isDark ? "rgba(217, 119, 6, 0.16)" : "#FEF3C7",
        border: isDark ? "rgba(245, 158, 11, 0.3)" : "#FDE68A",
        text: isDark ? "#FBBF24" : "#B45309",
        dot: "#F59E0B",
      };
    case "awaiting_user":
      return {
        bg: isDark ? "rgba(225, 29, 72, 0.16)" : "#FFE4E6",
        border: isDark ? "rgba(244, 63, 94, 0.3)" : "#FECDD3",
        text: isDark ? "#FB7185" : "#BE123C",
        dot: "#E11D48",
      };
    case "resolved":
      return {
        bg: isDark ? "rgba(5, 150, 105, 0.16)" : "#D1FAE5",
        border: isDark ? "rgba(16, 185, 129, 0.3)" : "#A7F3D0",
        text: isDark ? "#34D399" : "#047857",
        dot: "#10B981",
      };
    case "closed":
    default:
      return {
        bg: isDark ? "rgba(100, 116, 139, 0.16)" : "#F1F5F9",
        border: isDark ? "rgba(148, 163, 184, 0.3)" : "#E2E8F0",
        text: isDark ? "#94A3B8" : "#64748B",
        dot: "#94A3B8",
      };
  }
};

const AdminTicketStatusBadge = ({ status }: AdminTicketStatusBadgeProps) => {
  const palette = useAdminSurfacePalette();
  const tone = getStatusTone(status, palette.isDark);
  const label = supportStatusLabel(status);

  return (
    <View
      accessibilityLabel={`Status: ${label}`}
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tone.dot }} />
      <Text style={{ fontSize: 12, fontWeight: "600", color: tone.text }}>{label}</Text>
    </View>
  );
};

export default AdminTicketStatusBadge;
