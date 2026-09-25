import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

export type InlineAlertTone = "error" | "success" | "info" | "warning";

type InlineAlertProps = {
  tone?: InlineAlertTone;
  title?: string;
  message: string;
  action?: { label: string; onPress: () => void; loading?: boolean };
};

const ICONS: Record<InlineAlertTone, keyof typeof Feather.glyphMap> = {
  error: "alert-circle",
  success: "check-circle",
  info: "info",
  warning: "alert-triangle",
};

const InlineAlert = ({ tone = "error", title, message, action }: InlineAlertProps) => {
  const colors = useThemeColors();
  const palette = { error: colors.danger, success: colors.success, info: colors.info, warning: colors.warning }[tone];

  return (
    <FadeIn>
      <View
        accessibilityRole={tone === "error" ? "alert" : undefined}
        accessibilityLiveRegion="polite"
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: SPACING.sm,
          padding: SPACING.md,
          borderRadius: RADII.medium,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.bg,
        }}
      >
        <Feather name={ICONS[tone]} size={16} color={palette.fg} style={{ marginTop: 2 }} />
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          {title ? <Text style={[TYPE.bodyStrong, { color: palette.fg }]}>{title}</Text> : null}
          <Text style={[TYPE.body, { color: palette.fg }]}>{message}</Text>
        </View>
        {action ? (
          <Button variant="text" size="sm" label={action.label} onPress={action.onPress} loading={action.loading} />
        ) : null}
      </View>
    </FadeIn>
  );
};

export default InlineAlert;
