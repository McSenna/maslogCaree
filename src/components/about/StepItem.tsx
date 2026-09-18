import { Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";
import type { LearnMoreStep } from "@/config/learnMoreContent";

type StepItemProps = {
  step: LearnMoreStep;
  index: number;
  horizontal: boolean;
  showConnector: boolean;
};

const Badge = ({ index }: { index: number }) => (
  <View
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: LANDING_COLORS.primaryBlue,
    }}
  >
    <Text style={{ fontSize: 12.5, fontWeight: "800", color: LANDING_COLORS.white }}>
      {index + 1}
    </Text>
  </View>
);

const Connector = ({ horizontal }: { horizontal: boolean }) => (
  <View
    style={
      horizontal
        ? { flex: 1, height: 2, marginTop: 13, backgroundColor: LANDING_COLORS.border }
        : { width: 2, flex: 1, marginVertical: 4, backgroundColor: LANDING_COLORS.border }
    }
  />
);

const StepItem = ({ step, index, horizontal, showConnector }: StepItemProps) => {
  if (horizontal) {
    return (
      <View style={{ flex: 1, minWidth: 0, flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
          <Badge index={index} />
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: LANDING_COLORS.navy }}>
            {step.title}
          </Text>
          <Text style={{ fontSize: 12.5, lineHeight: 18, color: LANDING_COLORS.mutedText }}>
            {step.description}
          </Text>
        </View>

        {showConnector ? <Connector horizontal /> : null}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ alignItems: "center", width: 28 }}>
        <Badge index={index} />
        {showConnector ? <Connector horizontal={false} /> : null}
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: 3, paddingBottom: showConnector ? 14 : 0 }}>
        <Text style={{ fontSize: 13.5, fontWeight: "700", color: LANDING_COLORS.navy }}>
          {step.title}
        </Text>
        <Text style={{ fontSize: 12.5, lineHeight: 18, color: LANDING_COLORS.mutedText }}>
          {step.description}
        </Text>
      </View>
    </View>
  );
};

export default StepItem;
