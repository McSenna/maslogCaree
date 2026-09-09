import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { CONTROL_HEIGHT, RADIUS, useUsersPalette } from "./usersTheme";

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  /** Announced to screen readers — the placeholder is not a label. */
  accessibilityLabel: string;
  /** `minWidth` lets a wrapping toolbar break the row instead of crushing the input. */
  style?: { flex?: number; width?: `${number}%`; minWidth?: number };
};

/**
 * The admin toolbar search input.
 *
 * Shared by User Management and System Logs so the two toolbars cannot drift:
 * one height, one radius, one icon size, one focus treatment.
 */
export default function SearchField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  style,
}: SearchFieldProps) {
  const palette = useUsersPalette();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className="min-w-0 flex-row items-center gap-2.5 border px-3.5"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.cardBg,
        // The focus border is the only affordance a text field gets here — the
        // browser outline is suppressed below, so removing this would leave
        // keyboard users with no focus indication at all.
        borderColor: focused ? palette.primary : palette.cardBorder,
        ...style,
      }}
    >
      <Feather name="search" size={17} color={palette.subtle} />
      <TextInput
        className="min-w-0 flex-1 text-[14px]"
        style={{ color: palette.body, outlineStyle: "none" } as never}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={palette.subtle}
        accessibilityLabel={accessibilityLabel}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
