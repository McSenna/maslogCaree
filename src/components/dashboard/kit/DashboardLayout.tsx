import { Children, isValidElement, type ReactNode } from "react";
import { RefreshControl, ScrollView, View, type LayoutChangeEvent } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

/** Scroll container shared by every role dashboard: page backdrop, pull to refresh, and width measuring. */
export const DashboardScroll = ({
  palette,
  insets,
  refreshing,
  onRefresh,
  onMeasure,
  gap,
  children,
}: {
  palette: AdminDashboardPalette;
  insets: RoleScreenInsets;
  refreshing: boolean;
  onRefresh: () => void;
  onMeasure?: (event: LayoutChangeEvent) => void;
  gap: number;
  children: ReactNode;
}) => (
  <View className="flex-1">
    <RoleScreenBackdrop color={palette.pageBg} insets={insets} />
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: insets.gutter,
        paddingTop: insets.paddingTop,
        paddingBottom: insets.paddingBottom,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View style={{ width: "100%", alignSelf: "center", minWidth: 0, gap }} onLayout={onMeasure}>
        {children}
      </View>
    </ScrollView>
  </View>
);

/** Overview cards: one row of four when there is room, otherwise two rows of two. */
export const MetricRow = ({
  columns,
  gap,
  children,
}: {
  columns: 2 | 4;
  gap: number;
  children: ReactNode;
}) => {
  const cells = Children.toArray(children).filter(isValidElement);
  const rows = columns === 4 ? [cells] : [cells.slice(0, 2), cells.slice(2, 4)].filter((row) => row.length);

  return (
    <View style={{ gap }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row", gap }}>
          {row.map((cell, index) => (
            <View key={cell.key ?? index} style={{ flex: 1, minWidth: 0 }}>
              {cell}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

/**
 * Panels side by side at the given weights, or stacked in order when `stacked`. Null children are
 * skipped, so a role without a given panel doesn't leave an empty column.
 */
export const SplitRow = ({
  weights,
  stacked,
  gap,
  children,
}: {
  weights: number[];
  stacked: boolean;
  gap: number;
  children: ReactNode;
}) => {
  const panels = Children.toArray(children).filter(isValidElement);
  if (panels.length === 0) return null;

  if (stacked || panels.length === 1) {
    return <View style={{ gap }}>{panels}</View>;
  }

  return (
    <View style={{ flexDirection: "row", gap, alignItems: "stretch" }}>
      {panels.map((panel, index) => (
        <View key={panel.key ?? index} style={{ flex: weights[index] ?? 1, minWidth: 0 }}>
          {panel}
        </View>
      ))}
    </View>
  );
};
