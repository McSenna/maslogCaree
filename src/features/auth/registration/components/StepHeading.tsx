import { Text, View } from "react-native";
import { REG_COLORS } from "../registrationTheme";

type StepHeadingProps = { title: string; subtitle: string };

const StepHeading = ({ title, subtitle }: StepHeadingProps) => (
  <View style={{ gap: 4 }}>
    <Text
      accessibilityRole="header"
      style={{ fontSize: 19, fontWeight: "700", color: REG_COLORS.heading, letterSpacing: -0.2 }}
    >
      {title}
    </Text>
    <Text style={{ fontSize: 15.5, lineHeight: 22, color: REG_COLORS.muted }}>{subtitle}</Text>
  </View>
);

export default StepHeading;
