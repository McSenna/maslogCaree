import type { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

export type DashboardAction = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  accessibilityHint?: string;
  /**
   * Secondary actions are hidden on phones by default, where the bottom navigation already links to
   * the same screens. Set this for a secondary action that has no bottom-navigation equivalent.
   */
  showOnPhone?: boolean;
};

type DashboardHeaderProps = {
  palette: AdminDashboardPalette;
  title: string;
  /** One line under the title: today's date and the single most useful fact about the day. */
  subtitle: string;
  primaryAction?: DashboardAction;
  secondaryActions?: DashboardAction[];
  /** "Updated 4 min ago"; shown beside the refresh button. */
  updatedLabel?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  compact: boolean;
};

const RefreshButton = ({
  palette,
  onRefresh,
  refreshing,
  updatedLabel,
}: {
  palette: AdminDashboardPalette;
  onRefresh: () => void;
  refreshing: boolean;
  updatedLabel?: string;
}) => (
  <DashboardButton
    palette={palette}
    variant="secondary"
    icon="refresh-cw"
    label="Refresh"
    iconOnly
    size="md"
    onPress={onRefresh}
    loading={refreshing}
    accessibilityLabel={updatedLabel ? `Refresh dashboard. ${updatedLabel}` : "Refresh dashboard"}
  />
);

/**
 * The top of every role dashboard: who it is for, what today looks like, and the one or two things
 * the person is most likely here to do.
 */
const DashboardHeader = ({
  palette,
  title,
  subtitle,
  primaryAction,
  secondaryActions = [],
  updatedLabel,
  onRefresh,
  refreshing = false,
  compact,
}: DashboardHeaderProps) => {
  const heading = (
    <View className="min-w-0 gap-1" style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? "auto" : 320 }}>
      <Text
        role="heading"
        aria-level={1}
        className={compact ? "text-[22px] font-bold" : "text-[26px] font-bold"}
        style={{ color: palette.heading, lineHeight: compact ? 28 : 32, letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      <Text className="text-[14px] font-medium" style={{ color: palette.muted, lineHeight: 20 }}>
        {subtitle}
      </Text>
    </View>
  );

  if (compact) {
    const phoneSecondary = secondaryActions.filter((action) => action.showOnPhone);

    return (
      <View className="gap-3">
        {heading}
        {primaryAction || onRefresh ? (
          <View className="flex-row items-center gap-2">
            {primaryAction ? (
              <View className="min-w-0 flex-1">
                <DashboardButton
                  palette={palette}
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={primaryAction.icon}
                  label={primaryAction.label}
                  onPress={primaryAction.onPress}
                  accessibilityHint={primaryAction.accessibilityHint}
                />
              </View>
            ) : (
              <View className="flex-1" />
            )}
            {phoneSecondary.map((action) => (
              <DashboardButton
                key={action.key}
                palette={palette}
                variant="secondary"
                size="md"
                iconOnly
                icon={action.icon}
                label={action.label}
                onPress={action.onPress}
                accessibilityHint={action.accessibilityHint}
              />
            ))}
            {onRefresh ? (
              <RefreshButton
                palette={palette}
                onRefresh={onRefresh}
                refreshing={refreshing}
                updatedLabel={updatedLabel}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap items-end justify-between" style={{ columnGap: 24, rowGap: 16 }}>
      {heading}
      {/* Views default to flexShrink 0; without it this row keeps its one-line width and runs off tablet screens instead of wrapping. */}
      <View className="flex-row flex-wrap items-center" style={{ gap: 10, flexShrink: 1, minWidth: 0, maxWidth: "100%" }}>
        {updatedLabel ? (
          <Text className="text-[12.5px] font-medium" style={{ color: palette.subtle }}>
            {updatedLabel}
          </Text>
        ) : null}
        {onRefresh ? (
          <RefreshButton
            palette={palette}
            onRefresh={onRefresh}
            refreshing={refreshing}
            updatedLabel={updatedLabel}
          />
        ) : null}
        {secondaryActions.map((action) => (
          <DashboardButton
            key={action.key}
            palette={palette}
            variant="secondary"
            size="md"
            icon={action.icon}
            label={action.label}
            onPress={action.onPress}
            accessibilityHint={action.accessibilityHint}
          />
        ))}
        {primaryAction ? (
          <DashboardButton
            palette={palette}
            variant="primary"
            size="md"
            icon={primaryAction.icon}
            label={primaryAction.label}
            onPress={primaryAction.onPress}
            accessibilityHint={primaryAction.accessibilityHint}
          />
        ) : null}
      </View>
    </View>
  );
};

export default DashboardHeader;
