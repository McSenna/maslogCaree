import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import { cellSizing, type ColumnSizing } from "./columnLayout";
import { CellAlignContext } from "./TablePlacement";
import { CELL_PX } from "./tableTokens";
import type { Align } from "./types";

const ALIGN_ITEMS = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

type TableCellProps = {
  column: ColumnSizing & { align?: Align };
  header?: boolean;
  debug?: boolean;
  children?: ReactNode;
};

/**
 * The one cell used by the header, the rows and the skeleton. Size, padding and
 * alignment all come from the column, so a column's edges match in every row.
 */
const TableCell = ({ column, header = false, debug = false, children }: TableCellProps) => {
  const colors = useThemeColors();
  const semantic = Platform.OS === "web" ? (header ? "columnheader" : "cell") : undefined;

  return (
    <View
      role={semantic}
      style={[
        styles.cell,
        cellSizing(column),
        { alignItems: ALIGN_ITEMS[column.align ?? "left"] },
        debug
          ? {
              outlineWidth: 1,
              outlineStyle: "solid",
              outlineColor: colors.danger.fg,
            }
          : null,
      ]}
    >
      <CellAlignContext.Provider value={ALIGN_ITEMS[column.align ?? "left"]}>{children}</CellAlignContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  // Stretch to the row's height and centre the content, so single and two-line cells share a middle.
  // Clipping keeps an unbreakable value (a long email) inside its own column instead of painting over the next.
  cell: {
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: CELL_PX,
    overflow: "hidden",
  },
});

export default TableCell;
