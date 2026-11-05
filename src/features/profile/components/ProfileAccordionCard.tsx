import { Feather } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import { Animated, LayoutAnimation, Platform, Pressable, Text, View } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { EASING, USE_NATIVE_DRIVER, useReducedMotion, webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import type { ProfileSection } from "../utils/buildProfileSections";

const HEADER_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });
const HEADER_HEIGHT = 48;
const CHEVRON_MS = 200;
const SECTION_ICON = 22;

type ProfileAccordionCardProps = {
  section: ProfileSection;
  children: ReactNode;
};

const ProfileAccordionCard = ({ section, children }: ProfileAccordionCardProps) => {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(section.mobileExpanded);
  const rotation = useAnimatedValue(section.mobileExpanded ? 1 : 0);
  const { hovered, pressed, focused, handlers } = useInteractionState();

  const toggle = () => {
    const next = !expanded;
    if (Platform.OS !== "web" && !reducedMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    Animated.timing(rotation, {
      toValue: next ? 1 : 0,
      duration: reducedMotion ? 0 : CHEVRON_MS,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
    setExpanded(next);
  };

  return (
    <View
      style={{
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel={section.title}
        aria-expanded={expanded}
        onPress={toggle}
        style={{
          minHeight: HEADER_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.sm,
          borderRadius: RADII.medium,
          backgroundColor: hovered || pressed ? colors.surfaceHover : "transparent",
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          ...HEADER_WEB,
        }}
      >
        <Feather name={section.icon} size={SECTION_ICON} color={colors.muted} />
        <Text style={{ ...TYPE.bodyStrong, flex: 1, minWidth: 0, color: colors.heading }}>{section.title}</Text>
        <Animated.View
          style={{
            transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }],
          }}
        >
          <Feather name="chevron-down" size={20} color={colors.muted} />
        </Animated.View>
      </Pressable>

      {expanded ? (
        <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.xs, paddingBottom: SPACING.sm }}>{children}</View>
      ) : null}
    </View>
  );
};

export default ProfileAccordionCard;
