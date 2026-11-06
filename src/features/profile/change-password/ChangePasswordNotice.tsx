import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";

type ChangePasswordNoticeProps = {
  message: string;
  /** `danger`: the change did not happen. `warning`: no answer, so the outcome is unknown. */
  tone: "danger" | "warning";
  retryLabel?: string;
  onRetry?: () => void;
  retrying?: boolean;
};

const ICONS = { danger: "alert-circle", warning: "alert-triangle" } as const;

export const ChangePasswordNotice = ({ message, tone, retryLabel, onRetry, retrying = false }: ChangePasswordNoticeProps) => {
  const palette = useThemeColors()[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="gap-3 rounded-md border p-3"
      style={{ borderColor: palette.border, backgroundColor: palette.bg }}
    >
      <View className="flex-row items-start gap-3">
        <View aria-hidden className="pt-0.5">
          <Feather name={ICONS[tone]} size={16} color={palette.fg} />
        </View>
        <Text className="min-w-0 flex-1" style={[TYPE.body, { color: palette.fg }]}>
          {message}
        </Text>
      </View>
      {onRetry && retryLabel ? (
        <View className="flex-row justify-end">
          <Button variant="secondary" icon="refresh-cw" label={retryLabel} loading={retrying} onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
};

export default ChangePasswordNotice;
