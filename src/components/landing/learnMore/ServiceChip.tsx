import { Text, View } from "react-native";

import { LEARN_MORE_RADIUS, TONE_PALETTE } from "./learnMoreTheme";
import type { LearnMoreTone } from "@/config/learnMoreContent";

type ServiceChipProps = {
  label: string;
  tone: LearnMoreTone;
};

const ServiceChip = ({ label, tone }: ServiceChipProps) => {
  const palette = TONE_PALETTE[tone];

  return (
    <View
      style={{
        flexShrink: 1,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: LEARN_MORE_RADIUS.chip,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text style={{ fontSize: 11.5, fontWeight: "600", color: palette.fg }}>{label}</Text>
    </View>
  );
};

export default ServiceChip;
