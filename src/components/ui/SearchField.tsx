import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  style?: { flex?: number; width?: `${number}%`; minWidth?: number };
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
        clearButtonMode="while-editing"
      />
    </View>
  );
};

export default SearchField;
