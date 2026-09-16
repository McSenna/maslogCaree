import { Text, View } from "react-native";

import { PAD_X } from "./lineChartLayout";
import type { LineSeries } from "./lineChartTypes";

type Props = {
  series: LineSeries[];
  padLeft: number;
  tickColor: string;
};

const LineChartLegend = ({ series, padLeft, tickColor }: Props) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: padLeft,
        right: PAD_X,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {series
        .filter((s) => s.label)
        .map((s, i) => (
          <View
            key={`legend-${i}`}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <View
              style={{
                width: 20,
                height: 2,
                borderRadius: 2,
                backgroundColor: s.color,
                opacity: s.dashed ? 0.7 : 1,
              }}
            />
            <Text style={{ fontSize: 10, color: tickColor }}>{s.label}</Text>
          </View>
        ))}
    </View>
  );
};

export default LineChartLegend;
