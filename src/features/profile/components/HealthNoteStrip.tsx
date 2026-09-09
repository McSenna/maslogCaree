import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../config/profileTheme";

/**
 * The soft green reassurance strip under Personal Information in the reference
 * design — the one healthcare flourish inside the content column.
 */
const HealthNoteStrip = () => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: PROFILE_RADIUS.control,
      backgroundColor: PROFILE_COLORS.greenSoft,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PROFILE_COLORS.greenDeep,
      }}
    >
      <Feather name="shield" size={18} color="#FFFFFF" />
    </View>

    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={{ fontSize: 14.5, fontWeight: "700", color: "#065F46" }}>
        Your health matters.
      </Text>
      <Text style={{ marginTop: 2, fontSize: 12.5, color: "#047857" }}>
        Keep your information updated for a smoother healthcare experience.
      </Text>
    </View>
  </View>
);

export default HealthNoteStrip;
