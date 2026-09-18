import { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { USE_NATIVE_DRIVER, useReducedMotion } from "@/design/motion";

type NavItemLinkProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  isActive: boolean;
  isDesktop: boolean;
};

const NavItemLink = ({ label, icon, isActive, isDesktop }: NavItemLinkProps) => {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const indicator = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    const target = isActive || hovered ? 1 : 0;

    if (reducedMotion) {
      indicator.setValue(target);
      return;
    }

    const animation = Animated.timing(indicator, {
      toValue: target,
      duration: 180,
      useNativeDriver: USE_NATIVE_DRIVER,
    });

    animation.start();

    return () => animation.stop();
  }, [isActive, hovered, reducedMotion, indicator]);

  const tint = isActive || hovered ? "#FFFFFF" : "rgba(255,255,255,0.60)";

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      focusable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        alignItems: "center",
        gap: 5,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 6,
        backgroundColor: isActive ? "rgba(255,255,255,0.10)" : "transparent",
        transform: [{ scale: pressed ? 0.97 : 1 }],
        ...Platform.select({
          web: { cursor: "pointer", transition: "background-color 180ms ease" } as any,
        }),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <Feather name={icon} size={13} color={tint} />
        <Text
          style={{
            fontSize: isDesktop ? 13 : 12,
            fontWeight: isActive ? "700" : "500",
            color: tint,
          }}
        >
          {label}
        </Text>
      </View>

      <Animated.View
        style={{
          height: 2,
          width: "100%",
          borderRadius: 2,
          backgroundColor: isActive ? "#10b981" : "rgba(255,255,255,0.75)",
          opacity: indicator,
          transform: [{ scaleX: indicator }],
        }}
      />
    </Pressable>
  );
};

export default NavItemLink;
