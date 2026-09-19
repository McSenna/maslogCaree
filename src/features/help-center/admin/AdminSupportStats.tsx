import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { SupportStatus } from "../types/support.types";

type AdminSupportStatsProps = {
  counts: Partial<Record<SupportStatus, number>>;
  total: number;
};

type StatCardConfig = {
  key: string;
  label: string;
  count: number;
  context: string;
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  iconColor: string;
};

const AdminSupportStats = ({ counts, total }: AdminSupportStatsProps) => {
  const palette = useAdminSurfacePalette();
  const isDark = palette.isDark;

  const items: StatCardConfig[] = [
    {
      key: "total",
      label: "Total Requests",
      count: total,
      context: "All submissions",
      icon: "inbox",
      iconBg: isDark ? "rgba(99, 102, 241, 0.16)" : "#EEF2FF",
      iconColor: isDark ? "#818CF8" : "#4F46E5",
    },
    {
      key: "open",
      label: "Open",
      count: counts.open ?? 0,
      context: "Awaiting review",
      icon: "alert-circle",
      iconBg: isDark ? "rgba(2, 132, 199, 0.16)" : "#E0F2FE",
      iconColor: isDark ? "#38BDF8" : "#0284C7",
    },
    {
      key: "in_review",
      label: "In Review",
      count: counts.in_review ?? 0,
      context: "Under investigation",
      icon: "clock",
      iconBg: isDark ? "rgba(217, 119, 6, 0.16)" : "#FEF3C7",
      iconColor: isDark ? "#FBBF24" : "#D97706",
    },
    {
      key: "awaiting_user",
      label: "Awaiting Response",
      count: counts.awaiting_user ?? 0,
      context: "Pending resident",
      icon: "message-circle",
      iconBg: isDark ? "rgba(225, 29, 72, 0.16)" : "#FFE4E6",
      iconColor: isDark ? "#FB7185" : "#E11D48",
    },
    {
      key: "resolved",
      label: "Resolved",
      count: counts.resolved ?? 0,
      context: "Solutions provided",
      icon: "check-circle",
      iconBg: isDark ? "rgba(5, 150, 105, 0.16)" : "#D1FAE5",
      iconColor: isDark ? "#34D399" : "#059669",
    },
    {
      key: "closed",
      label: "Closed",
      count: counts.closed ?? 0,
      context: "Completed & archived",
      icon: "archive",
      iconBg: isDark ? "rgba(100, 116, 139, 0.16)" : "#F1F5F9",
      iconColor: isDark ? "#94A3B8" : "#64748B",
    },
  ];

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, width: "100%" }}>
      {items.map((item) => (
        <View
          key={item.key}
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 160,
            minWidth: 155,
            padding: 14,
            borderRadius: RADIUS.card,
            backgroundColor: palette.cardBg,
            borderWidth: 1,
            borderColor: palette.cardBorder,
            gap: 10,
            ...CARD_SHADOW,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, fontWeight: "600", color: palette.muted }}
            >
              {item.label}
            </Text>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: item.iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={item.icon} size={14} color={item.iconColor} />
            </View>
          </View>

          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: palette.heading,
                fontVariant: ["tabular-nums"],
              }}
            >
              {item.count}
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 11, color: palette.subtle }}>
              {item.context}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default AdminSupportStats;
