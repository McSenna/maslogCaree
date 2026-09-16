import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type ChartTooltipProps = {
  title: string;
  meta: string;
  x: number;
  y: number;
  containerWidth: number;
};

const WIDTH = 128;
const HEIGHT = 46;
const TAIL = 6;
const EDGE = 4;
const GAP = 8;

const ChartTooltip = ({ title, meta, x, y, containerWidth }: ChartTooltipProps) => {
  const { resolvedTheme } = useTheme();
  const background = resolvedTheme === "dark" ? "#1E293B" : "#0F2557";
  const border = resolvedTheme === "dark" ? "rgba(255,255,255,0.12)" : "transparent";

  const left = Math.min(Math.max(EDGE, x - WIDTH / 2), Math.max(EDGE, containerWidth - WIDTH - EDGE));
  const top = Math.max(0, y - HEIGHT - TAIL - GAP);
  const tailLeft = Math.min(Math.max(10, x - left - TAIL), WIDTH - TAIL * 2 - 10);

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left, top, width: WIDTH }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        className="items-center rounded-xl px-3 py-2"
        style={{
          backgroundColor: background,
          borderWidth: border === "transparent" ? 0 : 1,
          borderColor: border,
          shadowColor: "#0F172A",
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <Text numberOfLines={1} className="text-[12.5px] font-bold" style={{ color: "#FFFFFF" }}>
          {title}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-[11.5px] font-medium" style={{ color: "#CBD5E1" }}>
          {meta}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          left: tailLeft,
          bottom: -TAIL + 1,
          width: TAIL * 2,
          height: TAIL * 2,
          backgroundColor: background,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

export default ChartTooltip;
