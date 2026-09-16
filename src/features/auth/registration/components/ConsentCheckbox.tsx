import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { REG_COLORS } from "../registrationTheme";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ConsentCheckbox = ({ checked, onChange }: ConsentCheckboxProps) => (
  <Pressable
    onPress={() => onChange(!checked)}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 44,
      paddingVertical: 4,
    }}
  >
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: checked ? 0 : 1.5,
        borderColor: REG_COLORS.borderStrong,
        backgroundColor: checked ? REG_COLORS.primary : REG_COLORS.surface,
      }}
    >
      {checked ? <Feather name="check" size={14} color={REG_COLORS.surface} /> : null}
    </View>

    <Text style={{ flex: 1, fontSize: 13.5, lineHeight: 20, color: REG_COLORS.text }}>
      I agree to the{" "}
      <Text style={{ color: REG_COLORS.primary, fontWeight: "600" }}>Terms of Service</Text>
      {" and "}
      <Text style={{ color: REG_COLORS.primary, fontWeight: "600" }}>Privacy Policy</Text>.
    </Text>
  </Pressable>
);

export default ConsentCheckbox;
