import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MenuAnchor } from "../../userAdmin.types";

type RowMenuButtonProps = {
  name: string;
  open: boolean;
  /** Wide layouts pass the button's window position for the dropdown; phones open a sheet. */
  onOpen: (anchor: MenuAnchor | null) => void;
  popover: boolean;
};

/** The row's "more" button. Measures itself so the menu can open right under it. */
const RowMenuButton = ({ name, open, onOpen, popover }: RowMenuButtonProps) => {
  const palette = useAdminSurfacePalette();
  const ref = useRef<View>(null);

  const press = () => {
    const node = ref.current;
    if (!popover || !node) {
      onOpen(null);
      return;
    }
    node.measureInWindow((x, y, width, height) => onOpen({ x, y: y + height + 4, width }));
  };

  return (
    <Pressable
      ref={ref}
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`Actions for ${name}`}
      accessibilityState={{ expanded: open }}
      aria-expanded={open}
      className={`h-11 w-11 items-center justify-center rounded-control web:cursor-pointer ${open ? "bg-rowopen" : "hover:bg-rowopen active:bg-rowopen"}`}
    >
      <Feather name="more-horizontal" size={18} color={palette.body} />
    </Pressable>
  );
};

export default RowMenuButton;
