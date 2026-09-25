import type { ReactNode } from "react";
import { View } from "react-native";
import { ANALYTICS_FLEX } from "../../constants/dashboardLayout";
import GridCell from "../GridCell";

const AnalyticsRow = ({
  registrationPanel,
  activityTrendPanel,
  sideBySide,
  gap,
}: {
  registrationPanel: ReactNode;
  activityTrendPanel: ReactNode;
  sideBySide: boolean;
  gap: number;
}) =>
  sideBySide ? (
    <View style={{ flexDirection: "row", gap }}>
      <GridCell flex={ANALYTICS_FLEX.registrations}>{registrationPanel}</GridCell>
      <GridCell flex={ANALYTICS_FLEX.activity}>{activityTrendPanel}</GridCell>
    </View>
  ) : (
    <View style={{ gap }}>
      {registrationPanel}
      {activityTrendPanel}
    </View>
  );

export default AnalyticsRow;
