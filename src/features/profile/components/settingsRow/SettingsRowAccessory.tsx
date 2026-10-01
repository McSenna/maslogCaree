import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type SettingsRowAccessoryProps = {
  value?: string;
  badge?: string;
};

const SettingsRowAccessory = ({ value, badge }: SettingsRowAccessoryProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
      {badge ? (
        <View
          style={{
            paddingHorizontal: SPACING.sm,
            paddingVertical: SPACING.xxs,
            borderRadius: RADII.small,
            backgroundColor: colors.primarySoft,
          }}
        >
          <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, fontWeight: "700", color: colors.primary }}>
            {badge}
          </Text>
        </View>
      ) : null}

      {value ? (
        <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, color: colors.muted }}>
          {value}
        </Text>
      ) : null}

      <Feather name="chevron-right" size={18} color={colors.muted} />
    </View>
  );
};

export default SettingsRowAccessory;
