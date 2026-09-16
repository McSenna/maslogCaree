import { useMemo } from "react";
import {
  Animated,
  Modal,
  Pressable,
  useWindowDimensions,
  type GestureResponderEvent,
  type ViewStyle,
} from "react-native";

import { getHeaderPalette } from "./headerTokens";
import {
  ANCHOR_GAP,
  EDGE_MARGIN,
  FALLBACK_TOP,
  MENU_WIDTH,
  menuShadow,
  type ProfileAnchor,
  type ProfileMenuItem,
} from "./dropdown/dropdownTypes";
import { ProfileMenuRow } from "./dropdown/ProfileMenuRow";
import { useMenuTransition } from "./dropdown/useMenuTransition";

export type { ProfileAnchor, ProfileMenuItem } from "./dropdown/dropdownTypes";

type ProfileDropdownProps = {
  visible: boolean;
  onClose: () => void;
  anchor: ProfileAnchor | null;
  items: ProfileMenuItem[];
  isDark: boolean;
};

const ProfileDropdown = ({ visible, onClose, anchor, items, isDark }: ProfileDropdownProps) => {
  const palette = getHeaderPalette(isDark);
  const { width: screenWidth } = useWindowDimensions();
  const { mounted, style: transitionStyle } = useMenuTransition(visible);

  const position = useMemo(
    () => ({
      top: anchor ? anchor.y + anchor.height + ANCHOR_GAP : FALLBACK_TOP,
      right: anchor
        ? Math.max(screenWidth - (anchor.x + anchor.width), EDGE_MARGIN)
        : EDGE_MARGIN,
    }),
    [anchor, screenWidth]
  );

  const surfaceStyle = useMemo<ViewStyle>(
    () => ({
      borderRadius: 14,
      backgroundColor: palette.menuBg,
      borderWidth: 1,
      borderColor: palette.menuBorder,
      paddingVertical: 6,
      overflow: "hidden",
      ...menuShadow(isDark),
    }),
    [isDark, palette.menuBg, palette.menuBorder]
  );

  if (!mounted) return null;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close profile menu"
        onPress={onClose}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            { position: "absolute", width: MENU_WIDTH, ...position },
            transitionStyle,
          ]}
        >
          <Pressable
            onPress={(event: GestureResponderEvent) => event.stopPropagation()}
            style={surfaceStyle}
          >
            {items.map((item) => (
              <ProfileMenuRow
                key={item.key}
                item={item}
                palette={palette}
                onSelect={(selected) => {
                  onClose();
                  selected.onPress();
                }}
              />
            ))}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ProfileDropdown;
