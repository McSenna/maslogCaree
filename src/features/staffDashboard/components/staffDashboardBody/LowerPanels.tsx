import type { ReactElement } from "react";
import { View } from "react-native";

const LowerPanels = ({
  panels,
  twoPanelRow,
  gap,
}: {
  panels: ReactElement[];
  twoPanelRow: boolean;
  gap: number;
}) =>
  twoPanelRow ? (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
      {panels.map((panel) => (
        <View key={panel.key} style={{ flexGrow: 1, flexBasis: "46%", minWidth: 0 }}>
          {panel}
        </View>
      ))}
    </View>
  ) : (
    <View style={{ gap }}>{panels}</View>
  );

export default LowerPanels;
