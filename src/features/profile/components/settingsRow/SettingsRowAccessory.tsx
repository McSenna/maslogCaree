import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PROFILE_COLORS, PROFILE_RADIUS, PROFILE_TYPE } from "../../config/profileTheme";

type SettingsRowAccessoryProps = {
  value?: string;
  badge?: string;
  large: boolean;
};

const SettingsRowAccessory = ({ value, badge, large }: SettingsRowAccessoryProps) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
    {badge ? (
      <View
        style={{
          paddingHorizontal: 9,
          paddingVertical: 3,
          borderRadius: PROFILE_RADIUS.pill,
          backgroundColor: PROFILE_COLORS.primarySoft,
        }}
      >
        <Text
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 11.5, fontWeight: "700", color: PROFILE_COLORS.primary }}
        >
          {badge}
        </Text>
      </View>
    ) : null}

    {value ? (
      <Text
        maxFontSizeMultiplier={1.2}
        style={{ fontSize: PROFILE_TYPE.meta, color: PROFILE_COLORS.subtle }}
      >
        {value}
      </Text>
    ) : null}

    <Feather name="chevron-right" size={large ? 19 : 18} color={PROFILE_COLORS.subtle} />
  </View>
);

export default SettingsRowAccessory;
