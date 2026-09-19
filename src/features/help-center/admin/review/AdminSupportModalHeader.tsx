import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminTicketStatusBadge from "../AdminTicketStatusBadge";
import type { SupportStatus } from "../../types/support.types";

type AdminSupportModalHeaderProps = {
  ticketNumber: string;
  status: SupportStatus;
  onClose: () => void;
};

const AdminSupportModalHeader = ({
  ticketNumber,
  status,
  onClose,
}: AdminSupportModalHeaderProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
        backgroundColor: palette.subtleSurface,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: palette.isDark ? "rgba(2, 132, 199, 0.2)" : "#E0F2FE",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="help-circle" size={16} color={palette.primary} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: palette.heading }}>
              Review Support Request
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: palette.primary }}>
              {ticketNumber}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <AdminTicketStatusBadge status={status} />
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close review dialog"
          hitSlop={8}
          style={({ hovered }) => ({
            width: 30,
            height: 30,
            borderRadius: RADIUS.control,
            backgroundColor: hovered ? palette.cardBorder : "transparent",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Feather name="x" size={18} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
};

export default AdminSupportModalHeader;
