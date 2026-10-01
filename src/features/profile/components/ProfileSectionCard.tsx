import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type ProfileSectionCardProps = {
  title: string;
  action?: ReactNode;
  highlighted?: boolean;
  children: ReactNode;
};

const ProfileSectionCard = ({
  title,
  action,
  highlighted = false,
  children,
}: ProfileSectionCardProps) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        borderRadius: RADII.large,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: highlighted ? colors.primary : colors.border,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        gap: SPACING.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md, minHeight: 32 }}>
        <Text
          numberOfLines={2}
          maxFontSizeMultiplier={1.3}
          accessibilityRole="header"
          style={{ ...TYPE.title, flex: 1, minWidth: 0, color: colors.heading }}
        >
          {title}
        </Text>

        {action}
      </View>

      {children}
    </View>
  );
};

export default ProfileSectionCard;
