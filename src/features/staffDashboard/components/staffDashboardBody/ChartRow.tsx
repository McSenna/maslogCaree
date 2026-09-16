import type { ReactNode } from "react";
import { View } from "react-native";
import GridCell from "@/features/adminDashboard/components/GridCell";

const ChartRow = ({
  trend,
  split,
  twoPanelRow,
  gap,
}: {
  trend: ReactNode;
  split: ReactNode;
  twoPanelRow: boolean;
  gap: number;
}) =>
  split && twoPanelRow ? (
    <View style={{ flexDirection: "row", gap }}>
      <GridCell flex={2}>{trend}</GridCell>
      <GridCell flex={1}>{split}</GridCell>
    </View>
  ) : (
    <View style={{ gap }}>
      {trend}
      {split}
    </View>
  );

export default ChartRow;
