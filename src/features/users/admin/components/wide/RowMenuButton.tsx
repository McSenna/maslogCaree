import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MenuAnchor } from "../../userAdmin.types";

type RowMenuButtonProps = {
  name: string;
  open: boolean;
  onOpen: (anchor: MenuAnchor) => void;
};

/**
 * The row's "more" button, on every layout. Measures itself so the menu opens
 * beside it, and hands over a way to take focus back when the menu is dismissed.
 * Pressed and open states are the light row tint, never a dark underlay.
 */
const RowMenuButton = ({ name, open, onOpen }: RowMenuButtonProps) => {
  const palette = useAdminSurfacePalette();
  const ref = useRef<View>(null);

  const press = () =>
    ref.current?.measureInWindow((x, y, width, height) =>
      onOpen({ x, y, width, height, returnFocus: () => ref.current?.focus() })
    );

  return (
    <Pressable
      ref={ref}
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`More actions for ${name}`}
      accessibilityState={{ expanded: open }}
      aria-expanded={open}
      aria-haspopup="menu"
      className={`h-11 w-11 items-center justify-center rounded-control web:cursor-pointer ${open ? "bg-rowopen" : "hover:bg-rowopen active:bg-rowopen"}`}
    >
      <Feather name="more-horizontal" size={18} color={palette.body} />
    </Pressable>
  );
};

export default RowMenuButton;
