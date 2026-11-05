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
  fullWidth?: boolean;
};

const ICON_SIZE = 20;
// Under 40% two fields would share a row with a third. The minimum drops a narrow card to one column.
const HALF_BASIS = "40%";
const MIN_FIELD_WIDTH = 200;

/** One field in the details grid. Its value sits under its label and is never cut off. */
const ProfileInfoRow = ({ label, value, icon, provided = true, fullWidth = false }: ProfileInfoRowProps) => {
  const colors = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{
        flexGrow: 1,
        flexBasis: fullWidth ? "100%" : HALF_BASIS,
        minWidth: MIN_FIELD_WIDTH,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.md,
      }}
    >
      <Feather name={icon} size={ICON_SIZE} color={colors.muted} />
      <View style={{ flex: 1, minWidth: 0, gap: SPACING.xxs }}>
        <Text style={{ ...TYPE.caption, fontWeight: "400", color: colors.muted }}>{label}</Text>
        <Text style={{ ...TYPE.body, color: provided ? colors.heading : colors.muted }}>{value}</Text>
      </View>
    </View>
  );
};

export default ProfileInfoRow;
