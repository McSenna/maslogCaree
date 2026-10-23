import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";

type ChangePasswordNoticeProps = {
  message: string;
  /** `danger`: the server refused the change. `warning`: no answer, so the outcome is unknown. */
  tone: "danger" | "warning";
};

const ICONS = { danger: "alert-circle", warning: "alert-triangle" } as const;

export const ChangePasswordNotice = ({ message, tone }: ChangePasswordNoticeProps) => {
  const palette = useThemeColors()[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="flex-row items-start gap-3 rounded-md border p-3"
      style={{ borderColor: palette.border, backgroundColor: palette.bg }}
    >
      <View aria-hidden className="pt-0.5">
        <Feather name={ICONS[tone]} size={16} color={palette.fg} />
      </View>
      <Text className="min-w-0 flex-1" style={[TYPE.body, { color: palette.fg }]}>
        {message}
      </Text>
    </View>
  );
};

export default ChangePasswordNotice;
