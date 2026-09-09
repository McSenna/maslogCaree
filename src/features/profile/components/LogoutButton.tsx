import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../config/profileTheme";

type LogoutButtonProps = {
  onPress: () => void;
};

/**
 * Full-width sign-out control for the mobile profile (§24).
 *
 * Sits on a soft red field rather than a solid one: it is the last thing on the
 * screen and should read as deliberate, not alarming. The glyph gets its own
 * white chip so it carries the same weight as the section cards above it.
 */
const LogoutButton = ({ onPress }: LogoutButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out of MaslogCare"
        onPress={onPress}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
        // Press feedback rides on the class, not on a style callback: a
        // function-form `style` on Pressable is dropped here, taking the fill,
        // height and centring with it.
        className="flex-row items-center justify-center active:opacity-85"
        style={{
          gap: 11,
          minHeight: 58,
          paddingHorizontal: 18,
          borderRadius: PROFILE_RADIUS.card,
          borderWidth: 1,
          borderColor: PROFILE_COLORS.dangerBorder,
          backgroundColor: PROFILE_COLORS.dangerSoft,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: PROFILE_COLORS.surface,
          }}
        >
          <Feather name="log-out" size={17} color={PROFILE_COLORS.danger} />
        </View>

        <Text
          maxFontSizeMultiplier={1.3}
          style={{
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: -0.2,
            color: PROFILE_COLORS.danger,
          }}
        >
          Log Out
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default LogoutButton;
