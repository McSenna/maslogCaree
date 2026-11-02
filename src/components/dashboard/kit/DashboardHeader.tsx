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
  /** "Updated 4 min ago"; shown beside the actions on wide screens. */
  updatedLabel?: string;
  compact: boolean;
  /** Show only the actions while retaining the page name for screen readers. */
  hideHeading?: boolean;
};

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
  compact,
  hideHeading = false,
}: DashboardHeaderProps) => {
  const heading = hideHeading ? (
    <Text role="heading" aria-level={1} className="sr-only">{title}</Text>
  ) : (
    <View className="min-w-0 gap-1" style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? "auto" : 320 }}>
      <Text
        role="heading"
        aria-level={1}
        className={compact ? "text-[24px] font-bold" : "text-[28px] font-bold"}
        style={{ color: palette.heading, lineHeight: compact ? 30 : 34, letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      <Text className="text-[16px] font-medium" style={{ color: palette.muted, lineHeight: 22 }}>
        {subtitle}
      </Text>
    </View>
  );

  const visibleSecondary = compact ? secondaryActions.filter((action) => action.showOnPhone) : secondaryActions;
  if (hideHeading && !primaryAction && visibleSecondary.length === 0 && (compact || !updatedLabel)) return heading;

  if (compact) {
    const phoneSecondary = visibleSecondary;

    return (
      <View className="gap-3">
        {heading}
        {primaryAction || phoneSecondary.length > 0 ? (
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
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View className={`flex-row flex-wrap items-end ${hideHeading ? "justify-end" : "justify-between"}`} style={{ columnGap: 24, rowGap: 16 }}>
      {heading}
      {/* Views default to flexShrink 0; without it this row keeps its one-line width and runs off tablet screens instead of wrapping. */}
      <View className="flex-row flex-wrap items-center" style={{ gap: 10, flexShrink: 1, minWidth: 0, maxWidth: "100%" }}>
        {updatedLabel ? (
          <Text className="text-[14.5px] font-medium" style={{ color: palette.subtle }}>
            {updatedLabel}
          </Text>
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
