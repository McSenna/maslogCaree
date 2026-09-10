import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SIDEBAR_WIDTH } from "@/components/navigation/sidebar/sidebarTheme";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import { DENSE_METRIC_MAX_WIDTH, PANEL_FLEX } from "../constants/dashboardLayout";

/**
 * How many columns the dashboard has room for, and how wide each panel will be.
 *
 * Driven by the width the dashboard actually has, not the window: on desktop
 * the sidebar takes its own slice, and deciding from window width alone would
 * squeeze three panels into a space that fits two.
 */
export function useAdminDashboardLayout() {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useRoleScreenInsets();

  /**
   * The measuring wrapper is a plain View with an explicit width: NativeWind's
   * styled wrapper consumes onLayout, and an explicit width stops a child that
   * overflows mid-layout from widening the very box being measured.
   */
  const [measuredWidth, setMeasuredWidth] = useState(0);

  // The mobile content order is tied to the same breakpoint the shell uses to
  // swap the sidebar for the bottom nav, so the two never disagree.
  const isMobile = windowWidth < DASHBOARD_BREAKPOINTS.mobile;
  const gap = isMobile ? 12 : 16;

  const availableWidth =
    measuredWidth ||
    Math.max(
      280,
      windowWidth -
        insets.layoutPadding.horizontal * 2 -
        (isMobile ? 0 : SIDEBAR_WIDTH) -
        insets.gutter * 2
    );

  const metricColumns: 2 | 4 =
    isMobile || availableWidth < DASHBOARD_BREAKPOINTS.fourMetricColumns ? 2 : 4;

  const panelColumns: 1 | 2 | 3 = isMobile
    ? 1
    : availableWidth >= DASHBOARD_BREAKPOINTS.threePanelColumns
      ? 3
      : availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns
        ? 2
        : 1;

  /**
   * Widths the panels will actually get from the flex row, derived from the
   * same weights the layout uses. They only pick a row style — flexbox still
   * does the sizing — so being a few pixels out is harmless.
   */
  const panelRowWidth = availableWidth - gap * (panelColumns - 1);
  const panelWeightTotal =
    panelColumns === 3
      ? PANEL_FLEX.distribution + PANEL_FLEX.users + PANEL_FLEX.activities
      : panelColumns === 2
        ? PANEL_FLEX.distribution + PANEL_FLEX.users
        : 1;

  const chartPanelWidth =
    panelColumns === 1
      ? availableWidth
      : (panelRowWidth * PANEL_FLEX.distribution) / panelWeightTotal;
  const usersPanelWidth =
    panelColumns === 1
      ? availableWidth
      : (panelRowWidth * PANEL_FLEX.users) / panelWeightTotal;

  return {
    insets,
    isMobile,
    gap,
    availableWidth,
    metricColumns,
    panelColumns,
    chartPanelWidth,
    usersPanelWidth,
    denseMetrics: windowWidth <= DENSE_METRIC_MAX_WIDTH,
    /** True where the panels sit side by side and must stretch to match. */
    inColumns: !isMobile && panelColumns > 1,
    measuredWidth,
    measure: (event: { nativeEvent: { layout: { width: number } } }) => {
      const next = Math.round(event.nativeEvent.layout.width);
      if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
    },
  };
}

export type AdminDashboardLayout = ReturnType<typeof useAdminDashboardLayout>;
