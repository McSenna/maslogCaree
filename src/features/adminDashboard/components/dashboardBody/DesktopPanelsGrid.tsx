import type { ReactNode } from "react";
import { View } from "react-native";
import { PANEL_FLEX } from "../../constants/dashboardLayout";
import GridCell from "../GridCell";

const DesktopPanelsGrid = ({
  distributionPanel,
  usersPanel,
  activitiesPanel,
  panelColumns,
  gap,
}: {
  distributionPanel: ReactNode;
  usersPanel: ReactNode;
  activitiesPanel: ReactNode;
  panelColumns: number;
  gap: number;
}) =>
  panelColumns === 1 ? (
    <View className="gap-5">
      {distributionPanel}
      {usersPanel}
      {activitiesPanel}
    </View>
  ) : (
    <View className="gap-5">
      <View style={{ flexDirection: "row", gap }}>
        <GridCell flex={PANEL_FLEX.distribution}>{distributionPanel}</GridCell>
        <GridCell flex={PANEL_FLEX.users}>{usersPanel}</GridCell>
        {panelColumns === 3 ? <GridCell flex={PANEL_FLEX.activities}>{activitiesPanel}</GridCell> : null}
      </View>
      {panelColumns === 2 ? activitiesPanel : null}
    </View>
  );

export default DesktopPanelsGrid;
