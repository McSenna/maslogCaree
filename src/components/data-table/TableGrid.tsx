import { Platform, ScrollView, StyleSheet, View } from "react-native";

import type { ColumnPlan } from "./columnLayout";
import TableHeaderRow from "./TableHeaderRow";
import TableRow from "./TableRow";
import TableSkeleton from "./TableSkeleton";
import type { Column, DataTableProps } from "./types";

type TableGridProps<T> = Pick<
  DataTableProps<T>,
  "data" | "rowKey" | "caption" | "onRowPress" | "rowLabel" | "rowHint" | "isRowSelected" | "renderExpanded"
> & {
  plan: ColumnPlan<Column<T>>;
  loading: boolean;
  refreshing: boolean;
  pressMode: "button" | "pointer";
  density: "regular" | "compact";
  /** The last row keeps its divider when a footer follows it. */
  lastDivided: boolean;
  debug: boolean;
};

/**
 * Header and rows in one column, so they always share a width. When the
 * essential columns do not fit, both scroll sideways as one block.
 */
const TableGrid = <T,>({
  plan,
  data,
  rowKey,
  caption,
  loading,
  refreshing,
  pressMode,
  density,
  lastDivided,
  debug,
  onRowPress,
  rowLabel,
  rowHint,
  isRowSelected,
  renderExpanded,
}: TableGridProps<T>) => {
  const { visible, hiddenKeys, scrolls, contentWidth } = plan;
  const buttonRows = Boolean(onRowPress) && pressMode === "button";
  const context = { hiddenKeys };

  const grid = (
    <View
      role={Platform.OS === "web" ? (buttonRows ? "group" : "table") : undefined}
      accessibilityLabel={caption}
      style={contentWidth ? { width: contentWidth } : null}
    >
      <TableHeaderRow columns={visible} hiddenFromReaders={buttonRows} debug={debug} />
      {loading ? (
        <TableSkeleton columns={visible} caption={caption} density={density} debug={debug} />
      ) : (
        <View style={refreshing ? styles.refreshing : null} aria-busy={refreshing || undefined}>
          {data.map((row, index) => (
            <TableRow
              key={rowKey(row)}
              row={row}
              index={index}
              columns={visible}
              context={context}
              onPress={onRowPress ? () => onRowPress(row) : undefined}
              pressMode={pressMode}
              label={rowLabel?.(row)}
              hint={rowHint}
              selected={isRowSelected?.(row) ?? false}
              expanded={renderExpanded?.(row)}
              density={density}
              divided={lastDivided || index < data.length - 1}
              debug={debug}
            />
          ))}
        </View>
      )}
    </View>
  );

  if (!scrolls) return grid;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel={`${caption}, scrolls sideways`}>
      {grid}
    </ScrollView>
  );
};

// Rows being refetched stay readable but visibly stale.
const styles = StyleSheet.create({ refreshing: { opacity: 0.55 } });

export default TableGrid;
