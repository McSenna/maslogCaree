import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  type GestureResponderEvent,
  type ViewStyle,
} from "react-native";
import { getHeaderPalette, HEADER_FONT, type HeaderPalette } from "./headerTokens";

export type ProfileAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProfileMenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

type ProfileDropdownProps = {
  visible: boolean;
  onClose: () => void;
  anchor: ProfileAnchor | null;
  items: ProfileMenuItem[];
  isDark: boolean;
};

const MENU_WIDTH = 212;
const EDGE_MARGIN = 12;
/** Gap between the profile button and the menu below it. */
const ANCHOR_GAP = 8;
/** Where the menu sits when it opens before the button has reported its box. */
const FALLBACK_TOP = 72;
const OPEN_MS = 180;
const CLOSE_MS = 150;

/** How far the menu rises and how much it shrinks at rest (progress 0). */
const LIFT = -6;
const SHRINK = 0.97;

const menuShadow = (isDark: boolean): ViewStyle =>
  Platform.select<ViewStyle>({
    web: {
      boxShadow: isDark
        ? "0px 12px 28px rgba(2,6,23,0.55)"
        : "0px 12px 28px rgba(15,37,87,0.12)",
    },
    default: {
      shadowColor: "#0F2557",
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
  }) as ViewStyle;

/**
 * Keeps the menu mounted through its closing animation.
 *
 * One driver rather than an Animated.Value per property: opacity, lift and
 * scale always move together, and three separate values let the exit animate
 * only two of them — which is how `translateY` came to be reset on open
 * instead of animated on close.
 */
const useMenuTransition = (visible: boolean) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  // Read inside the effect but deliberately not a dependency: making `mounted`
  // one would restart the opening animation the moment mounting flips it.
  const mountedRef = useRef(mounted);
  mountedRef.current = mounted;

  useEffect(() => {
    if (visible) setMounted(true);
    else if (!mountedRef.current) return;

    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });

    // An open interrupted by a close (or the reverse) leaves the menu partway
    // through, which is where the new animation should start from.
    return () => animation.stop();
  }, [visible, progress]);

  const style = useMemo<Animated.WithAnimatedObject<ViewStyle>>(
    () => ({
      opacity: progress,
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [LIFT, 0] }) },
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [SHRINK, 1] }) },
      ],
    }),
    [progress]
  );

  return { mounted, style };
};

const ProfileMenuRow = ({
  item,
  palette,
  onSelect,
}: {
  item: ProfileMenuItem;
  palette: HeaderPalette;
  onSelect: (item: ProfileMenuItem) => void;
}) => {
  const [active, setActive] = useState(false);
  const tint = item.danger ? palette.danger : null;

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityLabel={item.label}
      onPress={() => onSelect(item)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        backgroundColor: active ? palette.menuHover : "transparent",
      }}
    >
      <Feather name={item.icon} size={16} color={tint ?? palette.muted} />
      <Text
        style={{
          fontFamily: HEADER_FONT,
          fontSize: 13.5,
          fontWeight: "500",
          color: tint ?? palette.title,
        }}
      >
        {item.label}
      </Text>
    </Pressable>
  );
};

const ProfileDropdown = ({
  visible,
  onClose,
  anchor,
  items,
  isDark,
}: ProfileDropdownProps) => {
  const palette = getHeaderPalette(isDark);
  const { width: screenWidth } = useWindowDimensions();
  const { mounted, style: transitionStyle } = useMenuTransition(visible);

  // Right-aligned to the profile button rather than positioned from the left,
  // so the menu stays under the button as the identity block changes width.
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
          {/* The backdrop closes the menu, so a press that lands on the menu
              itself must not reach it. */}
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
