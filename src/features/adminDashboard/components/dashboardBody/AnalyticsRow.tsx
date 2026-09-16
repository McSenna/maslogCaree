import type { ReactNode } from "react";
import { View } from "react-native";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import GridCell from "../GridCell";

const AnalyticsRow = ({
  registrationPanel,
  activityTrendPanel,
  isMobile,
  availableWidth,
  gap,
}: {
  registrationPanel: ReactNode;
  activityTrendPanel: ReactNode;
  isMobile: boolean;
  availableWidth: number;
  gap: number;
}) =>
  !isMobile && availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns ? (
    <View style={{ flexDirection: "row", gap }}>
      <GridCell flex={1.9}>{registrationPanel}</GridCell>
      <GridCell flex={1}>{activityTrendPanel}</GridCell>
    </View>
  ) : (
    <View style={{ gap }}>
      {registrationPanel}
      {activityTrendPanel}
    </View>
  );

export default AnalyticsRow;
