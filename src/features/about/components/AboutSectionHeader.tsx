import { Text, View } from "react-native";
import { HC } from "../constants/aboutTheme";
import MedicalCross from "./MedicalCross";

type AboutSectionHeaderProps = {
  eyebrow: string;
  title: string;
  isTablet: boolean;
};

const AboutSectionHeader = ({
  eyebrow,
  title,
  isTablet,
}: AboutSectionHeaderProps) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <MedicalCross size={14} color={HC.teal} />
        <Text
          style={{
            fontSize: isTablet ? 12 : 11,
            fontWeight: "800",
            color: HC.teal,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Text>
      </View>
      <Text style={{ fontSize: isTablet ? 24 : 20, fontWeight: "900", color: HC.navy }}>
        {title}
      </Text>
    </View>
  );
};

export default AboutSectionHeader;
