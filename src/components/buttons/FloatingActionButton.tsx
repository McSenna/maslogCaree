import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomNavMetrics } from "@/components/navigation/bottomNav";
import { BOTTOM_NAV_CONTENT_CLEARANCE } from "@/constants/layout";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { SHADOWS } from "@/theme/shadows";
import { SPACING } from "@/theme/spacing";
import { webStyle } from "@/theme/webStyle";

/** Material's standard FAB size; also clears the 48dp touch-target floor. */
export const FAB_SIZE = 56;
const FAB_GAP = SPACING.lg;

/**
 * Space a scrolling screen leaves under its last item so the button never
 * covers it: the button, its gap above the bottom navigation, and one more gap.
 */
export const FAB_CONTENT_CLEARANCE = FAB_SIZE + (FAB_GAP - BOTTOM_NAV_CONTENT_CLEARANCE) + FAB_GAP;

const WEB = webStyle({ cursor: "pointer", transition: webTransition("box-shadow") });

type Props = {
  icon: keyof typeof Feather.glyphMap;
  /** The action's name, read instead of the icon. */
  label: string;
  onPress: () => void;
};

/**
 * A round action button 16px above the phone bottom navigation and 16px from
 * the right edge. RoleLayout draws it in the same frame as the navigation, so
 * its place is plain arithmetic: the navigation's height (which already holds
 * the home-indicator inset, so the safe area is counted once) plus the gap.
 * Screen transitions never move it. Dialogs are native modals and sit above.
 */
const FloatingActionButton = ({ icon, label, onPress }: Props) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const nav = useBottomNavMetrics();
  const { hovered, focused, pressed, scaleStyle, handlers } = useInteractionState();

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", right: FAB_GAP + insets.right, bottom: nav.height + FAB_GAP }}
    >
      <Animated.View style={scaleStyle}>
        <Pressable
          {...handlers}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          className="items-center justify-center rounded-full"
          style={[
            { width: FAB_SIZE, height: FAB_SIZE, backgroundColor: colors.primary },
            hovered || pressed ? SHADOWS.overlay : SHADOWS.raised,
            focused ? { outlineWidth: 3, outlineColor: colors.focusRing, outlineStyle: "solid", outlineOffset: 2 } : null,
            WEB,
          ]}
        >
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden>
            <Feather name={icon} size={26} color={colors.onPrimary} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default FloatingActionButton;
