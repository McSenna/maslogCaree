import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <View
      accessibilityRole="alert"
      style={{
        flexDirection: "row",
        gap: 11,
        padding: 13,
        borderRadius: REG_RADIUS.card,
        borderWidth: 1,
        borderColor: "#F5C6C6",
        backgroundColor: REG_COLORS.errorSoft,
      }}
    >
      <Feather name="alert-circle" size={17} color={REG_COLORS.error} style={{ marginTop: 1 }} />
      <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: "#96262A" }}>{message}</Text>
    </View>
  );
};

export default FormError;
