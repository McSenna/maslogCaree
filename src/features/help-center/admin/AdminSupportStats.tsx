import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import InteractiveCard from "@/components/cards/InteractiveCard";
import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { SupportStatus } from "../types/support.types";
import { PALETTE, withAlpha } from "@/theme/palette";

type StatusFilter = SupportStatus | "all";

type AdminSupportStatsProps = {
  counts: Partial<Record<SupportStatus, number>>;
  activeStatus: StatusFilter;
  onSelectStatus: (status: StatusFilter) => void;
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

// Each card's slot in the wrapping row (the card itself fills it).
const SLOT = { flexGrow: 1, flexShrink: 1, flexBasis: 160, minWidth: 155 } as const;

const AdminSupportStats = ({ counts, activeStatus, onSelectStatus }: AdminSupportStatsProps) => {
  // The status counts ignore the status filter, so their sum stays the total
  // while a status card is selected (the list total would shrink to that status).
  const total = Object.values(counts).reduce((sum, count) => sum + (count ?? 0), 0);
  const palette = useAdminSurfacePalette();
  const isDark = palette.isDark;

  const items: StatCardConfig[] = [
    {
      key: "total",
      label: "Total Requests",
      count: total,
      context: "All submissions",
      icon: "inbox",
      iconBg: isDark ? withAlpha(PALETTE.blue[600], 0.16) : PALETTE.blue[50],
      iconColor: isDark ? PALETTE.blue[400] : PALETTE.blue[700],
    },
    {
      key: "open",
      label: "Open",
      count: counts.open ?? 0,
      context: "Awaiting review",
      icon: "alert-circle",
      iconBg: isDark ? withAlpha(PALETTE.blue[500], 0.16) : PALETTE.blue[100],
      iconColor: isDark ? PALETTE.blue[300] : PALETTE.blue[600],
    },
    {
      key: "in_review",
      label: "In Review",
      count: counts.in_review ?? 0,
      context: "Under investigation",
      icon: "clock",
      iconBg: isDark ? withAlpha(PALETTE.amber[500], 0.16) : PALETTE.amber[100],
      iconColor: isDark ? PALETTE.amber[300] : PALETTE.amber[600],
    },
    {
      key: "awaiting_user",
      label: "Awaiting Response",
      count: counts.awaiting_user ?? 0,
      context: "Pending resident",
      icon: "message-circle",
      iconBg: isDark ? withAlpha(PALETTE.red[600], 0.16) : PALETTE.red[100],
      iconColor: isDark ? PALETTE.red[300] : PALETTE.red[600],
    },
    {
      key: "resolved",
      label: "Resolved",
      count: counts.resolved ?? 0,
      context: "Solutions provided",
      icon: "check-circle",
      iconBg: isDark ? withAlpha(PALETTE.success[600], 0.16) : PALETTE.success[100],
      iconColor: isDark ? PALETTE.success[300] : PALETTE.success[600],
    },
    {
      key: "closed",
      label: "Closed",
      count: counts.closed ?? 0,
      context: "Completed & archived",
      icon: "archive",
      iconBg: isDark ? withAlpha(PALETTE.slate[500], 0.16) : PALETTE.slate[100],
      iconColor: isDark ? PALETTE.slate[400] : PALETTE.slate[500],
    },
  ];

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, width: "100%" }}>
      {items.map((item) => (
        <InteractiveCard
          key={item.key}
          onPress={() => onSelectStatus(item.key === "total" ? "all" : (item.key as SupportStatus))}
          accessibilityLabel={`${item.label}: ${item.count}. ${item.context}`}
          accessibilityHint={item.key === "total" ? "Shows every request" : `Shows ${item.label.toLowerCase()} requests`}
          selected={activeStatus === (item.key === "total" ? "all" : item.key)}
          radius={RADIUS.card}
          containerStyle={SLOT}
        >
          <View
            style={{
              flex: 1,
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
        </InteractiveCard>
      ))}
    </View>
  );
};

export default AdminSupportStats;
