import { Platform, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import TableCell from "./TableCell";
import { HEADER_HEIGHT, TABLE_TEXT } from "./tableTokens";
import type { Column } from "./types";

type TableHeaderRowProps<T> = {
  columns: Column<T>[];
  /** Rows that are single buttons announce their own summary; the labels would only repeat it. */
  hiddenFromReaders?: boolean;
  debug?: boolean;
};

const IS_WEB = Platform.OS === "web";

/** The heading band. Same cells, same sizing and same padding as every row below it. */
const TableHeaderRow = <T,>({ columns, hiddenFromReaders = false, debug = false }: TableHeaderRowProps<T>) => {
  const colors = useThemeColors();

  return (
    <View
      role={IS_WEB ? "row" : undefined}
      accessibilityRole={IS_WEB ? undefined : "header"}
      accessibilityElementsHidden={hiddenFromReaders}
      importantForAccessibility={hiddenFromReaders ? "no-hide-descendants" : "auto"}
      style={[
        styles.row,
        {
          backgroundColor: colors.tableHeader,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {columns.map((column) => (
        <TableCell key={column.key} column={column} header debug={debug}>
          {column.renderHeader ? (
            column.renderHeader()
          ) : (
            <Text
              numberOfLines={1}
              style={[TABLE_TEXT.header, { color: colors.body, textAlign: column.align ?? "left" }]}
            >
              {column.header}
            </Text>
          )}
        </TableCell>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderTopLeftRadius: RADII.small,
    borderTopRightRadius: RADII.small,
  },
});

export default TableHeaderRow;
