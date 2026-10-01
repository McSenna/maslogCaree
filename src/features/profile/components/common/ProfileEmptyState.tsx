import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { ProfileIconName } from "../../types/profile.types";

type ProfileEmptyStateProps = {
  icon: ProfileIconName;
  title: string;
  body: string;
  tone?: "neutral" | "error";
  action?: { label: string; onPress: () => void };
};

const ProfileEmptyState = ({ icon, title, body, tone = "neutral", action }: ProfileEmptyStateProps) => {
  const colors = useThemeColors();
  const isError = tone === "error";
  const badge = isError ? colors.danger : { bg: colors.surfaceMuted, fg: colors.muted };

  return (
    <View
      accessibilityRole={isError ? "alert" : "summary"}
      style={{
        alignItems: "center",
        gap: SPACING.sm,
        paddingVertical: SPACING.xxxl,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADII.large,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: badge.bg,
        }}
      >
        <Feather name={icon} size={21} color={badge.fg} />
      </View>

      <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.title, textAlign: "center", color: colors.heading }}>
        {title}
      </Text>

      <Text
        maxFontSizeMultiplier={1.3}
        style={{ ...TYPE.body, maxWidth: 380, textAlign: "center", color: colors.muted }}
      >
        {body}
      </Text>

      {action ? (
        <Button label={action.label} onPress={action.onPress} style={{ marginTop: SPACING.sm, alignSelf: "center" }} />
      ) : null}
    </View>
  );
};

export default ProfileEmptyState;
