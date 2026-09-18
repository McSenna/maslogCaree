import { Animated, Platform, type DimensionValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFloat } from "../motion/useFloat";

type FloatingGlyphProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
  size?: number;
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  distance?: number;
  duration?: number;
  delay?: number;
};

const FloatingGlyph = ({
  icon,
  color,
  background,
  size = 58,
  top,
  bottom,
  left,
  right,
  distance = 7,
  duration = 4800,
  delay = 0,
}: FloatingGlyphProps) => {
  const translateY = useFloat({ distance, duration, delay });

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: background,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.85)",
        transform: [{ translateY }],
        ...Platform.select({
          web: { boxShadow: "0px 10px 26px rgba(8, 21, 47, 0.10)" } as any,
          default: { elevation: 3 },
        }),
        pointerEvents: "none",
      }}
    >
      <Ionicons name={icon} size={Math.round(size * 0.44)} color={color} />
    </Animated.View>
  );
};

export default FloatingGlyph;
