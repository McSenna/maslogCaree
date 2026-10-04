import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { supportStatusLabel } from "../utils/support.utils";
import type { SupportStatus } from "../types/support.types";
import { PALETTE, withAlpha } from "@/theme/palette";

type AdminTicketStatusBadgeProps = {
  status: SupportStatus;
};

const getStatusTone = (status: SupportStatus, isDark: boolean) => {
  switch (status) {
    case "open":
      return {
        bg: isDark ? withAlpha(PALETTE.blue[500], 0.16) : PALETTE.blue[100],
        border: isDark ? withAlpha(PALETTE.blue[400], 0.3) : PALETTE.blue[200],
        text: isDark ? PALETTE.blue[400] : PALETTE.blue[600],
        dot: PALETTE.blue[600],
      };
    case "in_review":
      return {
        bg: isDark ? withAlpha(PALETTE.amber[500], 0.16) : PALETTE.amber[100],
        border: isDark ? withAlpha(PALETTE.amber[500], 0.3) : PALETTE.amber[100],
        text: isDark ? PALETTE.amber[300] : PALETTE.amber[600],
        dot: PALETTE.amber[500],
      };
    case "awaiting_user":
      return {
        bg: isDark ? withAlpha(PALETTE.red[600], 0.16) : PALETTE.red[100],
        border: isDark ? withAlpha(PALETTE.red[500], 0.3) : PALETTE.red[200],
        text: isDark ? PALETTE.red[300] : PALETTE.red[700],
        dot: PALETTE.red[600],
      };
    case "resolved":
      return {
        bg: isDark ? withAlpha(PALETTE.success[600], 0.16) : PALETTE.success[100],
        border: isDark ? withAlpha(PALETTE.success[500], 0.3) : PALETTE.success[200],
        text: isDark ? PALETTE.success[300] : PALETTE.success[700],
        dot: PALETTE.success[500],
      };
    case "closed":
    default:
      return {
        bg: isDark ? withAlpha(PALETTE.slate[500], 0.16) : PALETTE.slate[100],
        border: isDark ? withAlpha(PALETTE.slate[400], 0.3) : PALETTE.slate[200],
        text: isDark ? PALETTE.slate[400] : PALETTE.slate[500],
        dot: PALETTE.slate[400],
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
