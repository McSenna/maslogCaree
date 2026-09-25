import { Platform, Pressable, View } from "react-native";

type Props = {
  pointXs: number[];
  step: number;
  chartW: number;
  axisY: number;
  accessibilityLabelFor: (index: number) => string;
  onActivate: (index: number) => void;
  onClear: () => void;
};

const LineChartHitAreas = ({
  pointXs,
  step,
  chartW,
  axisY,
  accessibilityLabelFor,
  onActivate,
  onClear,
}: Props) => {
  return (
    <View style={{ position: "absolute", top: 0, left: 0, width: chartW, height: axisY }}>
      {pointXs.map((x, i) => (
        <Pressable
          key={`hit-${i}`}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabelFor(i)}
          onPressIn={() => onActivate(i)}
          onPressOut={onClear}
          onHoverIn={() => onActivate(i)}
          onHoverOut={onClear}
          onFocus={() => onActivate(i)}
          onBlur={onClear}
          style={{
            position: "absolute",
            left: Math.max(0, x - step / 2),
            top: 0,
            width: Math.max(24, step),
            height: axisY,
            ...Platform.select({ web: { cursor: "pointer" } }),
          }}
        />
      ))}
    </View>
  );
};

export default LineChartHitAreas;
