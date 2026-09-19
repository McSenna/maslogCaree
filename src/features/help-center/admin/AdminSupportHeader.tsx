import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type AdminSupportHeaderProps = {
  total: number;
  refreshing: boolean;
  onRefresh: () => void;
};

const AdminSupportHeader = ({ total, refreshing, onRefresh }: AdminSupportHeaderProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <View style={{ gap: 4, flex: 1, minWidth: 260 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 22, fontWeight: "700", color: palette.heading, letterSpacing: -0.2 }}
          >
            Support Management
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: RADIUS.pill,
              backgroundColor: palette.isDark ? "rgba(2, 132, 199, 0.18)" : "#E0F2FE",
              borderWidth: 1,
              borderColor: palette.isDark ? "rgba(56, 189, 248, 0.3)" : "#BAE6FD",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: palette.isDark ? "#38BDF8" : "#0284C7",
              }}
            >
              {total} {total === 1 ? "Ticket" : "Tickets"}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>
          Review, respond to, and manage support requests submitted by MaslogCare users.
        </Text>
      </View>

      <Pressable
        onPress={onRefresh}
        disabled={refreshing}
        accessibilityRole="button"
        accessibilityLabel="Refresh support tickets"
        style={({ hovered, pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          height: 38,
          paddingHorizontal: 14,
          borderRadius: RADIUS.control,
          backgroundColor: hovered ? palette.subtleSurface : palette.cardBg,
          borderWidth: 1,
          borderColor: palette.cardBorder,
          opacity: refreshing ? 0.6 : pressed ? 0.8 : 1,
        })}
      >
        <Feather
          name="refresh-cw"
          size={14}
          color={palette.body}
          style={refreshing ? { transform: [{ rotate: "45deg" }] } : undefined}
        />
        <Text style={{ fontSize: 13, fontWeight: "600", color: palette.heading }}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </Text>
      </Pressable>
    </View>
  );
};

export default AdminSupportHeader;
