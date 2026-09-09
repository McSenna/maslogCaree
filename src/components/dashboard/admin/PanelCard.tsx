import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type PanelCardProps = {
  palette: AdminDashboardPalette;
  title: string;
  /** Renders the "View All" affordance when provided. */
  onViewAll?: () => void;
  viewAllLabel?: string;
  /**
   * Trailing header content — a trend badge, say. Sits on the header's
   * baseline opposite the title, so a panel never has to position it against
   * the card body with offsets of its own.
   */
  headerRight?: ReactNode;
  children: ReactNode;
  /** Stretch to the height of the tallest panel in the row. */
  fill?: boolean;
  /**
   * Let the body take the height `fill` gained and centre its content in it.
   *
   * A stretched panel whose content is shorter than the row otherwise pins
   * that content to the top and drops the surplus underneath as dead space.
   * Panels with a single visual (the donut) opt in; list panels do not, since
   * their rows should start at the top.
   */
  centerContent?: boolean;
};

/** The white panel shell shared by the chart, users and activities cards. */
export default function PanelCard({
  palette,
  title,
  onViewAll,
  viewAllLabel = "View All",
  headerRight,
  children,
  fill = false,
  centerContent = false,
}: PanelCardProps) {
  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        flex: fill ? 1 : undefined,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[15px] font-bold" numberOfLines={1} style={{ color: palette.heading }}>
          {title}
        </Text>
        {headerRight ? <View className="shrink-0">{headerRight}</View> : null}
        {onViewAll ? (
          <Pressable
            onPress={onViewAll}
            accessibilityRole="link"
            accessibilityLabel={`${viewAllLabel} — ${title}`}
            // 44px minimum touch target without pushing the header taller.
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
              {viewAllLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View
        style={{
          flex: fill && centerContent ? 1 : undefined,
          justifyContent: centerContent ? "center" : undefined,
        }}
      >
        {children}
      </View>
    </View>
  );
}
