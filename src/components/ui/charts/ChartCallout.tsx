import { Text, View } from "react-native";

export type CalloutContent = { title: string; meta: string };

type ChartCalloutProps = {
  content: CalloutContent;
  x: number;
  y: number;
  containerWidth: number;
  background: string;
  border: string;
};

export const CALLOUT_W = 122;
export const CALLOUT_H = 44;
const TAIL = 6;

const ChartCallout = ({
  content,
  x,
  y,
  containerWidth,
  background,
  border,
}: ChartCalloutProps) => {
  const left = Math.min(
    Math.max(2, x - CALLOUT_W / 2),
    Math.max(2, containerWidth - CALLOUT_W - 2)
  );
  const top = Math.max(0, y - CALLOUT_H - TAIL - 8);
  const tailLeft = Math.min(Math.max(10, x - left - TAIL), CALLOUT_W - TAIL * 2 - 10);

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left, top, width: CALLOUT_W }}
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
          {content.title}
        </Text>
        <Text
          numberOfLines={1}
          className="mt-0.5 text-[11.5px] font-medium"
          style={{ color: "#CBD5E1" }}
        >
          {content.meta}
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
          borderColor: border === "transparent" ? undefined : border,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

export default ChartCallout;
