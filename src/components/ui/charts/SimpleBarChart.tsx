import { useMemo } from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";

export type SimpleBarDatum = {
  label: string;
  value: number;
  color?: string;
};

type SimpleBarChartProps = {
  data: SimpleBarDatum[];
  height?: number;
  radius?: number;
};

export default function SimpleBarChart({
  data,
  height = 120,
  radius = 8,
}: SimpleBarChartProps) {
  const max = useMemo(
    () => Math.max(1, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0))),
    [data]
  );

  const width = Math.max(1, data.length) * 28 + 8;

  return (
    <View style={{ height }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {data.map((d, i) => {
          const barH = Math.max(2, (d.value / max) * (height - 12));
          const x = 8 + i * 28;
          const y = height - barH - 6;
          return (
            <Rect
              key={`${d.label}-${i}`}
              x={x}
              y={y}
              width={18}
              height={barH}
              rx={radius}
              ry={radius}
              fill={d.color ?? "#2D5BFF"}
              opacity={0.9}
            />
          );
        })}
      </Svg>
    </View>
  );
}

