import { View } from "react-native";
import { HC } from "../constants/aboutTheme";

type MedicalCrossProps = {
  size?: number;
  color?: string;
  opacity?: number;
};

const MedicalCross = ({
  size = 16,
  color = HC.teal,
  opacity = 1,
}: MedicalCrossProps) => {
  const arm = size * 0.28;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", opacity }}>
      <View
        style={{
          position: "absolute",
          width: arm,
          height: size,
          backgroundColor: color,
          borderRadius: arm / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: arm,
          backgroundColor: color,
          borderRadius: arm / 2,
        }}
      />
    </View>
  );
};

export default MedicalCross;
