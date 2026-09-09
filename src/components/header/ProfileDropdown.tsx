import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
} from "react-native";
import { getHeaderPalette, HEADER_FONT } from "./headerTokens";

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
const OPEN_MS = 180;
const CLOSE_MS = 150;

const ProfileDropdown = ({
  visible,
  onClose,
  anchor,
  items,
  isDark,
}: ProfileDropdownProps) => {
  const palette = getHeaderPalette(isDark);
  const { width: screenWidth } = useWindowDimensions();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      opacity.setValue(0);
      translateY.setValue(-6);
      scale.setValue(0.97);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    if (!mounted) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.97,
        duration: CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, opacity, translateY, scale]);

  if (!mounted) return null;

  const top = anchor ? anchor.y + anchor.height + 8 : 72;
  const right = anchor
    ? Math.max(screenWidth - (anchor.x + anchor.width), EDGE_MARGIN)
    : EDGE_MARGIN;

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
          style={{
            position: "absolute",
            top,
            right,
            width: MENU_WIDTH,
            opacity,
            transform: [{ translateY }, { scale }],
          }}
        >
          <Pressable
            onPress={(e: any) => e?.stopPropagation?.()}
            style={{
              borderRadius: 14,
              backgroundColor: palette.menuBg,
              borderWidth: 1,
              borderColor: palette.menuBorder,
              paddingVertical: 6,
              overflow: "hidden",
              ...Platform.select({
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
              }),
            }}
          >
            {items.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                  backgroundColor:
                    pressed || hovered ? palette.menuHover : "transparent",
                })}
              >
                <Feather
                  name={item.icon}
                  size={16}
                  color={item.danger ? palette.danger : palette.muted}
                />
                <Text
                  style={{
                    fontFamily: HEADER_FONT,
                    fontSize: 13.5,
                    fontWeight: "500",
                    color: item.danger ? palette.danger : palette.title,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ProfileDropdown;
