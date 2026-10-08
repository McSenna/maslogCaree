import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import { useThemeColors } from "@/hooks/useThemeColors";

import TableCell from "./TableCell";
import { ROW_MIN_HEIGHT, SKELETON_ROWS, type TableDensity } from "./tableTokens";
import type { Column } from "./types";

type TableSkeletonProps<T> = {
  columns: Column<T>[];
  caption: string;
  density?: TableDensity;
  rows?: number;
  debug?: boolean;
};

/**
 * Placeholder rows built from the real columns at the real row height, so the
 * header never moves and nothing jumps when the data arrives.
 */
const TableSkeleton = <T,>({
  columns,
  caption,
  density = "regular",
  rows = SKELETON_ROWS,
  debug = false,
}: TableSkeletonProps<T>) => {
  const colors = useThemeColors();

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={`Loading ${caption.toLowerCase()}`}>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={[styles.divided, { borderBottomColor: colors.rowDivider }]}>
          <View style={[styles.cells, { minHeight: ROW_MIN_HEIGHT[density] }]}>
            {columns.map((column, index) => (
              <TableCell key={column.key} column={column} debug={debug}>
                <View className="w-full gap-2" style={column.align === "right" ? styles.end : null}>
                  <Skeleton className={index === 0 ? "h-3.5 w-[70%] rounded-xs" : "h-3 w-[60%] rounded-xs"} />
                  {index === 0 && density === "regular" ? <Skeleton className="h-3 w-[40%] rounded-xs" /> : null}
                </View>
              </TableCell>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Same structure as TableRow (divider outside, padded cells inside), so the heights match exactly.
  divided: { borderBottomWidth: 1 },
  cells: { flexDirection: "row", paddingVertical: 8 },
  end: { alignItems: "flex-end" },
});

export default TableSkeleton;
