import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

type VerificationIconBadgeProps = {
  name: keyof typeof Feather.glyphMap;
  color: string;
  background: string;
};

const VerificationIconBadge = ({ name, color, background }: VerificationIconBadgeProps) => (
  <View
    style={{
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: background,
    }}
  >
    <Feather name={name} size={24} color={color} />
  </View>
);

export default VerificationIconBadge;
