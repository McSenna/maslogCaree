import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webStyle } from "@/theme/webStyle";

import { cellContent } from "./cellContent";
import { focusRing } from "./focusRing";
import TableCell from "./TableCell";
import { CELL_PX, ROW_HOVER_MS, ROW_MIN_HEIGHT, type TableDensity } from "./tableTokens";
import type { CellContext, Column } from "./types";

type TableRowProps<T> = {
  row: T;
  index: number;
  columns: Column<T>[];
  context: CellContext;
  onPress?: () => void;
  pressMode: "button" | "pointer";
  label?: string;
  hint?: string;
  selected: boolean;
  expanded?: ReactNode;
  density: TableDensity;
  divided: boolean;
  debug: boolean;
};

const HOVER = webStyle({
  transition: `background-color ${ROW_HOVER_MS}ms ease-out`,
});
const CLICKABLE = webStyle({ cursor: "pointer" });
// RN-web gives every Pressable a pointer; rows that open nothing keep the default cursor.
const STATIC = webStyle({ cursor: "default" });

/**
 * A body row: the column cells side by side, nothing between them, so each
 * cell's edges are exactly the header cell's edges above it.
 */
const TableRow = <T,>({
  row,
  index,
  columns,
  context,
  onPress,
  pressMode,
  label,
  hint,
  selected,
  expanded,
  density,
  divided,
  debug,
}: TableRowProps<T>) => {
  const colors = useThemeColors();
  const isButton = Boolean(onPress) && pressMode === "button";
  const { hovered, focused, handlers } = useInteractionState();
  const background = selected ? colors.rowSelected : hovered ? colors.rowHover : "transparent";

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessible={isButton}
      focusable={isButton}
      // Only a row that is itself the control is a tab stop; RN-web would otherwise give every row one.
      tabIndex={isButton ? 0 : -1}
      role={isButton || Platform.OS !== "web" ? undefined : "row"}
      accessibilityRole={isButton ? "button" : undefined}
      accessibilityLabel={isButton ? label : undefined}
      accessibilityHint={isButton ? hint : undefined}
      accessibilityState={selected ? { selected } : undefined}
      aria-selected={selected || undefined}
      style={[
        {
          backgroundColor: background,
          borderBottomColor: colors.rowDivider,
          borderBottomWidth: divided ? 1 : 0,
        },
        focused && isButton
          ? focusRing(colors.focusRing, -2)
          : null,
        HOVER,
        onPress ? CLICKABLE : STATIC,
      ]}
    >
      <View style={[styles.cells, { minHeight: ROW_MIN_HEIGHT[density] }]}>
        {columns.map((column) => (
          <TableCell key={column.key} column={column} debug={debug}>
            {cellContent(column, row, index, context)}
          </TableCell>
        ))}
      </View>
      {expanded ? <View style={styles.expanded}>{expanded}</View> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Vertical padding only: horizontal space belongs to the cells, never to the row.
  cells: { flexDirection: "row", paddingVertical: 8 },
  expanded: { paddingHorizontal: CELL_PX, paddingBottom: 16 },
});

export default TableRow;
