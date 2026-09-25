import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import FadeIn from "@/components/animations/FadeIn";

export type FeedbackAction = { label: string; onPress: () => void; loading?: boolean };

export type FeedbackStateProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
  tone?: "neutral" | "error" | "success";
  action?: FeedbackAction;
  secondaryAction?: FeedbackAction;
  compact?: boolean;
};

const FeedbackState = ({
  icon,
  title,
  description,
  tone = "neutral",
  action,
  secondaryAction,
  compact = false,
}: FeedbackStateProps) => {
  const colors = useThemeColors();
  const badge = tone === "error" ? colors.danger : tone === "success" ? colors.success : null;

  return (
    <FadeIn>
      <View
        accessibilityRole={tone === "error" ? "alert" : undefined}
        style={{ width: "100%", alignItems: "center", gap: 12, paddingHorizontal: 24, paddingVertical: compact ? 24 : 48 }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: badge?.bg ?? colors.primarySoft,
          }}
        >
          <Feather name={icon} size={20} color={badge?.fg ?? colors.primary} />
        </View>

        <View style={{ alignItems: "center", gap: 4, maxWidth: 420 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.heading, textAlign: "center" }}>{title}</Text>
          {description ? (
            <Text style={{ fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: "center" }}>{description}</Text>
          ) : null}
        </View>

        {action || secondaryAction ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 }}>
            {secondaryAction ? (
              <Button variant="secondary" size="sm" label={secondaryAction.label} onPress={secondaryAction.onPress} />
            ) : null}
            {action ? (
              <Button
                size="sm"
                label={action.label}
                onPress={action.onPress}
                loading={action.loading}
                icon={tone === "error" ? "refresh-cw" : undefined}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </FadeIn>
  );
};

export default FeedbackState;
