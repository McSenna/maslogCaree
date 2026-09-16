import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RECOVERY_COLORS as C } from "../../recoveryTheme";

export const StepIcon = ({
  icon,
  tone = "primary",
}: {
  icon: keyof typeof Feather.glyphMap;
  tone?: "primary" | "success";
}) => (
  <View
    className="h-14 w-14 items-center justify-center rounded-full"
    style={{ backgroundColor: tone === "success" ? C.successSoft : C.primarySoft }}
  >
    <Feather name={icon} size={24} color={tone === "success" ? C.success : C.primary} />
  </View>
);

export const StepHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View className="w-full items-center gap-1.5">
    <Text
      accessibilityRole="header"
      className="text-center text-[20px] font-bold"
      style={{ color: C.text }}
    >
      {title}
    </Text>
    <Text className="text-center text-[13.5px] leading-[20px]" style={{ color: C.muted }}>
      {subtitle}
    </Text>
  </View>
);
