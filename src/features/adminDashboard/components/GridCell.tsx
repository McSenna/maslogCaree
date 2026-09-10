import type { ReactNode } from "react";
import { View } from "react-native";

/**
 * Grid cell.
 *
 * Columns are flex weights rather than measured pixel widths: flexbox divides
 * the row exactly, so a cell can never overflow its row or wrap onto the next
 * one while a layout pass is still settling.
 */
export default function GridCell({
  flex = 1,
  children,
}: {
  flex?: number;
  children: ReactNode;
}) {
  return <View style={{ flex, minWidth: 0 }}>{children}</View>;
}
