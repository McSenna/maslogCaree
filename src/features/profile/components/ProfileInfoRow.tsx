import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_TYPE } from "../config/profileTheme";

type ProfileInfoRowProps = {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  /** Dims the value when the account has nothing stored for this field. */
  provided?: boolean;
  showDivider?: boolean;
  /** Stacks label above value — used at narrow widths so long emails fit. */
  stacked?: boolean;
};

/**
 * Icon | Label | Value, the unit the Personal Information card is built from.
 */
const ProfileInfoRow = ({
  label,
  value,
  icon,
  provided = true,
  showDivider = true,
  stacked = false,
}: ProfileInfoRowProps) => (
  <View
    accessible
    accessibilityLabel={`${label}: ${value}`}
    style={{
      flexDirection: "row",
      alignItems: stacked ? "flex-start" : "center",
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: showDivider ? 1 : 0,
      borderBottomColor: PROFILE_COLORS.divider,
    }}
  >
    <View style={{ width: 22, alignItems: "center", paddingTop: stacked ? 1 : 0 }}>
      <Feather name={icon} size={17} color={PROFILE_COLORS.primary} />
    </View>

    <View
      style={{
        flex: 1,
        minWidth: 0,
        flexDirection: stacked ? "column" : "row",
        alignItems: stacked ? "flex-start" : "center",
        gap: stacked ? 2 : 12,
      }}
    >
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
        style={{
          fontSize: PROFILE_TYPE.label,
          fontWeight: "500",
          color: PROFILE_COLORS.muted,
          ...(stacked ? {} : { width: 132 }),
        }}
      >
        {label}
      </Text>

      <Text
        // Long values (emails, addresses) wrap rather than overflow the card.
        maxFontSizeMultiplier={1.3}
        style={{
          flex: stacked ? undefined : 1,
          minWidth: 0,
          fontSize: PROFILE_TYPE.value,
          fontWeight: provided ? "600" : "500",
          textAlign: stacked ? "left" : "right",
          color: provided ? PROFILE_COLORS.heading : PROFILE_COLORS.subtle,
          fontStyle: provided ? "normal" : "italic",
        }}
      >
        {value}
      </Text>
    </View>
  </View>
);

export default ProfileInfoRow;
