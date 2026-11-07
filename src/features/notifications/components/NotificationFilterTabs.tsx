import React, { useCallback } from "react";
import { Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { NOTIFICATION_METRICS, NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";

type NotificationFilterTabsProps = {
  value: NotificationFilter;
  onChange: (next: NotificationFilter) => void;
  totalCount: number;
  unreadCount: number;
  compact?: boolean;
};

const Tab = ({
  label,
  count,
  active,
  compact,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  compact: boolean;
  onPress: () => void;
}) => {
  const palette = useNotificationPalette();
  const { focusRing } = useThemeColors();
  const { hovered, focused, handlers } = useInteractionState({ pressScale: 1 });
  const labelColor = active ? palette.onPrimary : palette.heading;
  const countColor = active ? palette.onPrimary : palette.body;
  const fontSize = compact ? TYPE.label.fontSize : TYPE.bodyStrong.fontSize;

  return (
    <StatePressable
      accessibilityRole="tab"
      accessibilityLabel={`${label}, ${count} notifications`}
      accessibilityState={{ selected: active }}
      aria-selected={active}
      {...handlers}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        height: compact ? NOTIFICATION_METRICS.compactChipHeight : NOTIFICATION_METRICS.chipHeight,
        paddingHorizontal: compact ? SPACING.md : SPACING.lg + SPACING.xs,
        borderRadius: NOTIFICATION_RADIUS.chip,
        backgroundColor: active ? palette.primary : palette.neutralSoft,
        opacity: pressed ? 0.8 : hovered ? 0.9 : 1,
        outlineWidth: focused ? 2 : 0,
        outlineOffset: 2,
        outlineColor: focusRing,
        outlineStyle: "solid",
      })}
    >
      <Text maxFontSizeMultiplier={1.2} style={{ fontSize, fontWeight: "600", color: labelColor }}>
        {label}
      </Text>
      <Text
        maxFontSizeMultiplier={1.2}
        style={{ fontSize, fontWeight: "600", color: countColor, fontVariant: ["tabular-nums"] }}
      >
        {count > 99 ? "99+" : count}
      </Text>
    </StatePressable>
  );
};

const NotificationFilterTabs = ({
  value,
  onChange,
  totalCount,
  unreadCount,
  compact = false,
}: NotificationFilterTabsProps) => {
  const selectAll = useCallback(() => onChange("all"), [onChange]);
  const selectUnread = useCallback(() => onChange("unread"), [onChange]);

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Filter notifications"
      style={{ flexDirection: "row", flexWrap: "wrap", gap: compact ? SPACING.sm : SPACING.md }}
    >
      <Tab label="All" count={totalCount} active={value === "all"} compact={compact} onPress={selectAll} />
      <Tab
        label="Unread"
        count={unreadCount}
        active={value === "unread"}
        compact={compact}
        onPress={selectUnread}
      />
    </View>
  );
};

export default React.memo(NotificationFilterTabs);
