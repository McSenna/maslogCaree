import { useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import FieldShell from "@/features/auth/registration/components/FieldShell";
import { fieldSurface } from "@/features/auth/registration/components/fieldStyles";
import {
  REG_COLORS,
  REG_RADIUS,
} from "@/features/auth/registration/registrationTheme";

type Props = {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  height: number;
};

/** Desktop overlays upward; phone options expand below in the form scroll. */
const MasterPurokDropdown = ({
  value,
  options,
  onChange,
  error,
  disabled,
  height,
}: Props) => {
  const { isDesktopWeb } = useResponsive();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const suppressEscapeRelease = useRef(false);
  const root = useRef<View>(null);
  const trigger = useRef<View>(null);
  const selected = options.find((option) => option.value === value);
  const expanded = open && !disabled;

  const focusTrigger = () => {
    if (Platform.OS === "web")
      (trigger.current as unknown as HTMLElement | null)?.focus();
  };

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = root.current as unknown as HTMLElement | null;
    const buttons = () =>
      Array.from(node?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []);
    if (expanded) {
      node?.scrollIntoView({ block: isDesktopWeb ? "end" : "nearest" });
      const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
      );
      const option = buttons()[selectedIndex];
      option?.focus({ preventScroll: true });
      option?.scrollIntoView({ block: "nearest" });
    }
    const closeOutside = (event: Event) => {
      if (node && !node.contains(event.target as Node)) setOpen(false);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (!node?.contains(event.target as Node) || disabled) return;
      if (!expanded) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (event.key === "Escape") {
        // Handle this before the dialog's Escape listener so only the list closes.
        event.preventDefault();
        event.stopPropagation();
        suppressEscapeRelease.current = true;
        setOpen(false);
        focusTrigger();
        return;
      }
      const items = buttons();
      const index = items.indexOf(document.activeElement as HTMLElement);
      let next: number;
      switch (event.key) {
        case "ArrowDown":
          next = Math.min(items.length - 1, index + 1);
          break;
        case "ArrowUp":
          next = Math.max(0, index - 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = items.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      items[next]?.focus({ preventScroll: true });
      items[next]?.scrollIntoView({ block: "nearest" });
    };
    const keyUp = (event: KeyboardEvent) => {
      // React Native Web's Modal also dismisses on keyup, after the list closes.
      if (event.key === "Escape" && suppressEscapeRelease.current) {
        event.stopPropagation();
        suppressEscapeRelease.current = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    window.addEventListener("keydown", keyDown, true);
    window.addEventListener("keyup", keyUp, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      window.removeEventListener("keydown", keyDown, true);
      window.removeEventListener("keyup", keyUp, true);
    };
  }, [expanded, disabled, options, value, isDesktopWeb]);

  return (
    <FieldShell label="Purok" required error={error}>
      <View
        ref={root}
        style={{
          ...fieldSurface({
            focused: focused || expanded,
            invalid: Boolean(error),
            disabled,
          }),
          overflow: isDesktopWeb ? "visible" : "hidden",
          zIndex: expanded && isDesktopWeb ? 10 : undefined,
        }}
      >
        <Pressable
          ref={trigger}
          onPress={() => setOpen((previous) => !previous)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Purok"
          accessibilityValue={{ text: selected?.label ?? "Select purok" }}
          accessibilityState={{ expanded, disabled }}
          aria-expanded={expanded}
          aria-disabled={disabled}
          style={{
            height: height - 2,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            gap: 10,
          }}
        >
          <Feather name="home" size={17} color={REG_COLORS.subtle} />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 15,
              color: selected ? REG_COLORS.text : REG_COLORS.subtle,
            }}
          >
            {selected?.label ?? "Select purok"}
          </Text>
          <Feather
            name={
              isDesktopWeb
                ? expanded
                  ? "chevron-down"
                  : "chevron-up"
                : expanded
                  ? "chevron-up"
                  : "chevron-down"
            }
            size={17}
            color={REG_COLORS.muted}
          />
        </Pressable>
        {expanded ? (
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={
              isDesktopWeb
                ? {
                    position: "absolute",
                    bottom: "100%",
                    left: -1,
                    right: -1,
                    height: 240,
                    marginBottom: 6,
                    borderWidth: 1,
                    borderColor: REG_COLORS.borderStrong,
                    borderRadius: REG_RADIUS.control,
                    backgroundColor: REG_COLORS.surface,
                  }
                : {
                    maxHeight: 240,
                    borderTopWidth: 1,
                    borderTopColor: REG_COLORS.border,
                  }
            }
            contentContainerStyle={{ padding: 4 }}
          >
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Purok options"
            >
              {options.map((option) => {
                const checked = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityLabel={option.label}
                    accessibilityState={{ checked, selected: checked }}
                    aria-checked={checked}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                      focusTrigger();
                    }}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: REG_RADIUS.control - 8,
                      backgroundColor:
                        checked || pressed
                          ? REG_COLORS.primarySoft
                          : REG_COLORS.surface,
                    })}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        lineHeight: 20,
                        fontWeight: checked ? "600" : "400",
                        color: checked ? REG_COLORS.primary : REG_COLORS.text,
                      }}
                    >
                      {option.label}
                    </Text>
                    {checked ? (
                      <Feather
                        name="check"
                        size={17}
                        color={REG_COLORS.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        ) : null}
      </View>
    </FieldShell>
  );
};

export default MasterPurokDropdown;
