import { Feather } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

export type UserAction = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
};

type UserActionsMenuProps = {
  palette: AdminDashboardPalette;
  actions: UserAction[];
  accessibilityLabel: string;
};

const MENU_WIDTH = 216;
const ROW_HEIGHT = 42;
const EDGE = 8;

/**
 * Three-dot row menu.
 *
 * The actions are hidden until the trigger is pressed, then drawn in a modal
 * anchored to the trigger's measured position — a plain absolutely positioned
 * dropdown would be clipped by the panel's rounded container and by the scroll
 * view on native.
 */
export default function UserActionsMenu({
  palette,
  actions,
  accessibilityLabel,
}: UserActionsMenuProps) {
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const open = useCallback(() => {
    const menuHeight = actions.length * ROW_HEIGHT + 12;

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      // Right-align to the trigger, then keep the whole menu on screen.
      const left = Math.min(
        Math.max(EDGE, x + width - MENU_WIDTH),
        Math.max(EDGE, windowWidth - MENU_WIDTH - EDGE)
      );
      const below = y + height + 6;
      const top =
        below + menuHeight > windowHeight ? Math.max(EDGE, y - menuHeight - 6) : below;

      setAnchor({ top, left });
    });
  }, [actions.length, windowHeight, windowWidth]);

  const close = useCallback(() => setAnchor(null), []);

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Opens actions for this user"
        hitSlop={10}
        className="h-8 w-8 items-center justify-center rounded-full"
        style={({ pressed }) => ({
          backgroundColor: pressed ? palette.divider : "transparent",
        })}
      >
        <Feather name="more-vertical" size={16} color={palette.subtle} />
      </Pressable>

      <Modal visible={Boolean(anchor)} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={close}
          className="flex-1"
        />
        {anchor ? (
          <View
            className="absolute rounded-xl border py-1.5"
            style={{
              top: anchor.top,
              left: anchor.left,
              width: MENU_WIDTH,
              backgroundColor: palette.menuBg,
              borderColor: palette.menuBorder,
              shadowColor: "#0F2557",
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            {actions.map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole="menuitem"
                onPress={() => {
                  close();
                  action.onPress();
                }}
                className="flex-row items-center gap-2.5 px-3.5"
                style={({ pressed }) => ({
                  height: ROW_HEIGHT,
                  backgroundColor: pressed ? palette.divider : "transparent",
                })}
              >
                <Feather name={action.icon} size={15} color={palette.muted} />
                <Text className="text-[13px] font-medium" style={{ color: palette.body }}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Modal>
    </>
  );
}
