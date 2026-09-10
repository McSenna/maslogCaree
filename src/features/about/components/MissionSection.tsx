import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { HC } from "../constants/aboutTheme";
import AboutSectionHeader from "./AboutSectionHeader";

/** What the service is for, beside its icon. */
export default function MissionSection({ isTablet }: { isTablet: boolean }) {
  return (
    <View>
      <AboutSectionHeader eyebrow="Our Purpose" title="Mission & Vision" isTablet={isTablet} />
      <View
        style={{
          backgroundColor: HC.white,
          borderRadius: 18,
          padding: 16,
          flexDirection: "row",
          gap: 14,
          borderWidth: 1,
          borderColor: HC.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: HC.tealPale,
            borderWidth: 1,
            borderColor: HC.tealMid,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Feather name="target" size={20} color={HC.teal} />
        </View>
        <Text
          style={{
            flex: 1,
            color: HC.slate,
            lineHeight: isTablet ? 22 : 20,
            fontSize: isTablet ? 14 : 12.5,
          }}
        >
          To empower Barangay Maslog residents through accessible, digital health services —
          fostering a community where every individual receives timely and compassionate care.
        </Text>
      </View>
    </View>
  );
}
