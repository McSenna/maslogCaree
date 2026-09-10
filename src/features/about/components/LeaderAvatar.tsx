import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

type LeaderAvatarProps = {
  icon: keyof typeof Feather.glyphMap;
  size: number;
  iconColor: string;
  /** The dashed ring around the avatar. */
  ringColor: string;
  ringWidth: number;
  fill: string;
  borderColor: string;
  borderWidth: number;
  marginBottom: number;
};

/** The dashed ring and filled circle every org-chart card carries. */
export default function LeaderAvatar({
  icon,
  size,
  iconColor,
  ringColor,
  ringWidth,
  fill,
  borderColor,
  borderWidth,
  marginBottom,
}: LeaderAvatarProps) {
  const outerSize = size + 12;

  return (
    <View
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: outerSize / 2,
        borderWidth: ringWidth,
        borderColor: ringColor,
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        marginBottom,
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: fill,
          alignItems: "center",
          justifyContent: "center",
          borderWidth,
          borderColor,
        }}
      >
        <Feather name={icon} size={Math.round(size * 0.38)} color={iconColor} />
      </View>
    </View>
  );
}
