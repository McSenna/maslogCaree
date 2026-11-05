import { Animated, View } from "react-native";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import Block from "./Block";

type SectionSkeletonProps = {
  rows: number;
  opacity: Animated.Value;
  /** "fields" stacks a label over its value. "links" is one short line each. */
  shape?: "fields" | "links";
};

const SectionSkeleton = ({ rows, opacity, shape = "links" }: SectionSkeletonProps) => (
  <View style={{ gap: SPACING.lg }}>
    <Block width="45%" height={18} opacity={opacity} />

    {Array.from({ length: rows }).map((_, index) => (
      <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md }}>
        <Block width={20} height={20} radius={RADII.small} opacity={opacity} />
        <View style={{ flex: 1, gap: SPACING.xs }}>
          {shape === "fields" ? <Block width="25%" height={12} opacity={opacity} /> : null}
          <Block width={shape === "fields" ? "55%" : "60%"} height={14} opacity={opacity} />
        </View>
      </View>
    ))}
  </View>
);

export default SectionSkeleton;
