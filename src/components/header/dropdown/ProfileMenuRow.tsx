import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text } from "react-native";

import { HEADER_FONT, type HeaderPalette } from "../headerTokens";
import type { ProfileMenuItem } from "./dropdownTypes";

export const ProfileMenuRow = ({
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
