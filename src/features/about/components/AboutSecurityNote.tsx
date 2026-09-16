import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { HC } from "../constants/aboutTheme";

const AboutSecurityNote = ({ isTablet }: { isTablet: boolean }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 8,
      }}
    >
      <View style={{ borderRadius: 50, padding: 6, backgroundColor: HC.tealPale }}>
        <Feather name="lock" size={11} color={HC.teal} />
      </View>
      <Text style={{ color: HC.slateLight, fontSize: isTablet ? 12 : 11 }}>
        Secure &amp; exclusively for Barangay Maslog residents
      </Text>
    </View>
  );
};

export default AboutSecurityNote;
