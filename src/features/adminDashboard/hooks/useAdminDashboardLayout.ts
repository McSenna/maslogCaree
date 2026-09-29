import { useState } from "react";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import {
  ANALYTICS_SIDE_BY_SIDE_MIN_WIDTH,
  DENSE_METRIC_MAX_WIDTH,
  PEOPLE_FLEX,
} from "../constants/dashboardLayout";

export const useAdminDashboardLayout = () => {
  const { width: windowWidth, breakpoint, isMobile } = useResponsive();
  const insets = useRoleScreenInsets();

  const [measuredWidth, setMeasuredWidth] = useState(0);

  const gap = isMobile ? 12 : 16;

  const availableWidth =
    measuredWidth ||
    Math.max(
      280,
      windowWidth -
        insets.layoutPadding.horizontal * 2 -
        getSidebarWidth(breakpoint) -
        insets.gutter * 2
    );

  const metricColumns: 2 | 4 =
    isMobile || availableWidth < DASHBOARD_BREAKPOINTS.fourMetricColumns ? 2 : 4;

  const stackPanels = isMobile || availableWidth < ANALYTICS_SIDE_BY_SIDE_MIN_WIDTH;

  const chartPanelWidth = stackPanels
    ? availableWidth
    : ((availableWidth - gap) * PEOPLE_FLEX.distribution) / (PEOPLE_FLEX.users + PEOPLE_FLEX.distribution);

  return {
    insets,
    isMobile,
    gap,
    availableWidth,
    metricColumns,
    stackPanels,
    chartPanelWidth,
    denseMetrics: windowWidth <= DENSE_METRIC_MAX_WIDTH,
    measure: (event: { nativeEvent: { layout: { width: number } } }) => {
      const next = Math.round(event.nativeEvent.layout.width);
      if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
    },
  };
};

export type AdminDashboardLayout = ReturnType<typeof useAdminDashboardLayout>;
