import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PROFILE_COLORS, PROFILE_TYPE } from "../../config/profileTheme";

const ContactItem = ({
  icon,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string;
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 7, minWidth: 0 }}>
      <Feather name={icon} size={15} color={PROFILE_COLORS.primary} />
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={{
          fontSize: PROFILE_TYPE.label,
          fontWeight: "500",
          color: PROFILE_COLORS.body,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default ContactItem;
