import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type ProfileInfoRowProps = {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  provided?: boolean;
  iconColor?: string;
};

/** Facebook "Intro" style: the value leads, its label sits quietly underneath. */
const ProfileInfoRow = ({ label, value, icon, provided = true, iconColor }: ProfileInfoRowProps) => {
  const colors = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{ flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, paddingVertical: SPACING.sm }}
    >
      <View style={{ width: 24, height: TYPE.body.lineHeight, alignItems: "center", justifyContent: "center" }}>
        <Feather name={icon} size={18} color={iconColor ?? colors.muted} />
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          maxFontSizeMultiplier={1.3}
          style={{
            ...(provided ? TYPE.bodyStrong : TYPE.body),
            color: provided ? colors.heading : colors.subtle,
            fontStyle: provided ? "normal" : "italic",
          }}
        >
          {value}
        </Text>
        <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, color: colors.muted }}>
          {label}
        </Text>
      </View>
    </View>
  );
};

export default ProfileInfoRow;
