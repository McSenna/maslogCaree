import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

const SecurityNotice = () => (
  <View
    style={{
      flexDirection: "row",
      gap: 12,
      padding: 14,
      borderRadius: REG_RADIUS.card,
      borderWidth: 1,
      borderColor: "#CFE4D6",
      backgroundColor: REG_COLORS.secondarySoft,
    }}
  >
    <Feather name="shield" size={18} color={REG_COLORS.secondary} style={{ marginTop: 1 }} />
    <View style={{ flex: 1, gap: 3 }}>
      <Text style={{ fontSize: 13.5, fontWeight: "700", color: "#14532D" }}>
        Your information is secure.
      </Text>
      <Text style={{ fontSize: 12.5, lineHeight: 18, color: "#3F6B4E" }}>
        MaslogCare protects your personal information and keeps your healthcare data
        confidential.
      </Text>
    </View>
  </View>
);

export default SecurityNotice;
