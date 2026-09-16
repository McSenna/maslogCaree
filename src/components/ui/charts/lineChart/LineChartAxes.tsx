import { Text, View } from "react-native";

import { PAD_BOTTOM, PAD_TOP, TICKS } from "./lineChartLayout";

type Props = {
  labels: string[];
  pointXs: number[];
  step: number;
  axisMax: number;
  chartW: number;
  innerH: number;
  padLeft: number;
  axisY: number;
  tickColor: string;
  showYAxis: boolean;
  activeIndex: number | null;
};

const LineChartAxes = ({
  labels,
  pointXs,
  step,
  axisMax,
  chartW,
  innerH,
  padLeft,
  axisY,
  tickColor,
  showYAxis,
  activeIndex,
}: Props) => {
  return (
    <>
      {showYAxis && (
        <View style={{ position: "absolute", top: 0, left: 0, width: padLeft - 4, height: axisY }}>
          {Array.from({ length: TICKS + 1 }, (_, t) => t / TICKS).map((t) => (
            <Text
              key={t}
              numberOfLines={1}
              style={{
                position: "absolute",
                top: PAD_TOP + innerH * (1 - t) - 6,
                left: 0,
                right: 0,
                textAlign: "right",
                fontSize: 10,
                fontVariant: ["tabular-nums"],
                color: tickColor,
              }}
            >
              {Math.round(axisMax * t)}
            </Text>
          ))}
        </View>
      )}

      <View style={{ position: "absolute", top: axisY + 5, left: 0, right: 0, height: PAD_BOTTOM }}>
        {labels.map((lab, i) => {
          const x = pointXs[i];
          if (x === undefined) return null;
          const boxW = Math.max(24, Math.min(56, step));
          const left = Math.min(Math.max(0, x - boxW / 2), Math.max(0, chartW - boxW));
          return (
            <Text
              key={`${lab}-${i}`}
              numberOfLines={1}
              style={{
                position: "absolute",
                left,
                width: boxW,
                textAlign: "center",
                fontSize: 10,
                fontWeight: i === activeIndex ? "600" : "400",
                color: tickColor,
              }}
            >
              {lab}
            </Text>
          );
        })}
      </View>
    </>
  );
};

export default LineChartAxes;
