import { View } from "react-native";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

type RoleScreenBackdropProps = {
  /** The page tint, from the screen's own palette. */
  color: string;
  insets: Pick<RoleScreenInsets, "layoutPadding">;
};

/**
 * The page tint, painted edge to edge behind the shell's padding.
 *
 * The navigator draws its own plain surface over the shell's, so a page that
 * does not paint its ground sits on white instead of the admin near-white.
 * This bleeds back out by exactly the shell's padding so the colour reaches
 * the screen edges rather than stopping at the content box.
 */
export default function RoleScreenBackdrop({ color, insets }: RoleScreenBackdropProps) {
  const { layoutPadding } = insets;

  return (
    <View
      style={{
        position: "absolute",
        top: -layoutPadding.top,
        bottom: -layoutPadding.bottom,
        left: -layoutPadding.horizontal,
        right: -layoutPadding.horizontal,
        backgroundColor: color,
      }}
    />
  );
}
