import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "./usersTheme";

export type SelectOption<T extends string> = { value: T; label: string };

type SelectMenuProps<T extends string> = {
  /** Announced to screen readers; the trigger itself shows the selected label. */
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  /**
   * Shown on the trigger instead of the selected option's label.
   *
   * For a date-range menu, "Sep 1 – Sep 7, 2026" tells the reader more than
   * "Last 7 Days" does; the menu itself still lists the preset names.
   */
  displayValue?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Matches the search field so every control on the row lines up. */
  height?: number;
  style?: { flex?: number; width?: number | `${number}%`; minWidth?: number };
};

const MENU_MIN_WIDTH = 200;
const EDGE = 8;

/**
 * Dropdown used by the toolbar.
 *
 * The list is drawn in a modal anchored to the measured trigger rather than as
 * an absolutely positioned child: inside the table card an inline menu is
 * clipped by the rounded container, and on native it is clipped by the scroll
 * view as well.
 */
export default function SelectMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  displayValue,
  icon,
  height = 48,
  style,
}: SelectMenuProps<T>) {
  const palette = useUsersPalette();
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const selected = options.find((o) => o.value === value) ?? options[0];
  const triggerLabel = displayValue ?? selected?.label ?? "";

  const open = useCallback(() => {
    const menuHeight = Math.min(options.length * 44 + 12, 300);

    triggerRef.current?.measureInWindow((x, y, w, h) => {
      const menuWidth = Math.max(MENU_MIN_WIDTH, w);
      const left = Math.min(Math.max(EDGE, x), Math.max(EDGE, windowWidth - menuWidth - EDGE));
      const below = y + h + 6;
      const top = below + menuHeight > windowHeight ? Math.max(EDGE, y - menuHeight - 6) : below;
      setAnchor({ top, left, width: menuWidth });
    });
  }, [options.length, windowHeight, windowWidth]);

  const close = useCallback(() => setAnchor(null), []);
  const isOpen = anchor !== null;

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${triggerLabel}`}
        accessibilityState={{ expanded: isOpen }}
        className="flex-row items-center justify-between gap-2 border px-3.5"
        style={{
          height,
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardBg,
          borderColor: isOpen ? palette.primary : palette.cardBorder,
          ...style,
        }}
      >
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          {icon ? <MaterialCommunityIcons name={icon} size={16} color={palette.muted} /> : null}
          <Text numberOfLines={1} className="text-[14px] font-medium" style={{ color: palette.body }}>
            {triggerLabel}
          </Text>
        </View>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={palette.muted} />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={close}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={close} className="flex-1" />
        {anchor ? (
          <View
            className="absolute border p-1"
            style={{
              top: anchor.top,
              left: anchor.left,
              width: anchor.width,
              borderRadius: RADIUS.control,
              backgroundColor: palette.menuBg,
              borderColor: palette.menuBorder,
              ...CARD_SHADOW,
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <ScrollView style={{ maxHeight: 288 }} nestedScrollEnabled>
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      close();
                      onChange(option.value);
                    }}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isActive }}
                    className="justify-center px-3 active:opacity-70"
                    style={{
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: isActive ? palette.rowSelected : "transparent",
                    }}
                  >
                    <Text
                      className={`text-[14px] ${isActive ? "font-semibold" : "font-medium"}`}
                      style={{ color: isActive ? palette.primary : palette.body }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </>
  );
}
