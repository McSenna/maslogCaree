import { useState } from "react";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DENSE_METRIC_MAX_WIDTH } from "@/features/adminDashboard/constants/dashboardLayout";

export const useStaffDashboardLayout = () => {
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

  const twoPanelRow = !isMobile && availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns;

  return {
    insets,
    isMobile,
    gap,
    availableWidth,
    metricColumns,
    twoPanelRow,
    denseMetrics: windowWidth <= DENSE_METRIC_MAX_WIDTH,
    measure: (event: { nativeEvent: { layout: { width: number } } }) => {
      const next = Math.round(event.nativeEvent.layout.width);
      if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
    },
  };
};

export type StaffDashboardLayout = ReturnType<typeof useStaffDashboardLayout>;
