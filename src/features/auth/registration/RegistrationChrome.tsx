import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { REG_COLORS } from "./registrationTheme";

type RegistrationChromeProps = {
  onClose: () => void;
  isSheet: boolean;
};

const RegistrationChrome = ({ onClose, isSheet }: RegistrationChromeProps) => (
  <View style={{ gap: isSheet ? 10 : 14 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <MaslogCareLogo size={isSheet ? 30 : 34} />
      <Text
        style={{
          flex: 1,
          fontSize: isSheet ? 15 : 16,
          fontWeight: "800",
          letterSpacing: -0.3,
          color: REG_COLORS.heading,
        }}
      >
        MaslogCare
      </Text>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close registration"
        hitSlop={10}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: REG_COLORS.surfaceMuted,
        }}
      >
        <Feather name="x" size={17} color={REG_COLORS.muted} />
      </Pressable>
    </View>

    <View style={{ gap: 3 }}>
      <Text
        accessibilityRole="header"
        style={{
          fontSize: isSheet ? 21 : 24,
          fontWeight: "800",
          letterSpacing: -0.5,
          color: REG_COLORS.heading,
        }}
      >
        Create Your Account
      </Text>
      <Text style={{ fontSize: 13.5, lineHeight: 20, color: REG_COLORS.muted }}>
        Join MaslogCare as a resident.
      </Text>
    </View>
  </View>
);

export default RegistrationChrome;
