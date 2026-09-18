import { Text, View } from "react-native";

import { ABOUT_RADIUS, TONE_PALETTE } from "./aboutTheme";
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
        borderRadius: ABOUT_RADIUS.chip,
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
