import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SIDEBAR_WIDTH } from "@/components/navigation/sidebar/sidebarTheme";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import { DENSE_METRIC_MAX_WIDTH, PANEL_FLEX } from "../constants/dashboardLayout";

export const useAdminDashboardLayout = () => {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useRoleScreenInsets();

  const [measuredWidth, setMeasuredWidth] = useState(0);

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
    inColumns: !isMobile && panelColumns > 1,
    measuredWidth,
    measure: (event: { nativeEvent: { layout: { width: number } } }) => {
      const next = Math.round(event.nativeEvent.layout.width);
      if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
    },
  };
};

export type AdminDashboardLayout = ReturnType<typeof useAdminDashboardLayout>;
