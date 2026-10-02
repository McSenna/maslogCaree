import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  style?: { flex?: number; width?: number | `${number}%`; minWidth?: number };
};

const SearchField = ({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  style,
}: SearchFieldProps) => {
  const palette = useAdminSurfacePalette();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className="min-w-0 flex-row items-center gap-2.5 border px-3.5"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.cardBg,
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
      />
      {value ? (
        // One clear control on every platform (iOS's built-in one would double it).
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          className="h-8 w-8 items-center justify-center rounded-sm web:cursor-pointer"
        >
          <Feather name="x" size={16} color={palette.muted} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SearchField;
