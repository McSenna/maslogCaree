import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import { cellContent } from "./cellContent";
import { TABLE_TEXT } from "./tableTokens";
import type { CardRole, CellContext, Column } from "./types";

const NOTHING_HIDDEN: CellContext = { hiddenKeys: new Set() };

/** First column is the title and a column keyed "actions" holds the buttons, unless a column says otherwise. */
export const cardRoleOf = <T,>(column: Column<T>, index: number): CardRole =>
  column.cardRole ?? (index === 0 ? "title" : column.key === "actions" ? "actions" : "field");

type AutoCardProps<T> = { columns: Column<T>[]; row: T; index: number };

/**
 * A phone card built from the table's own columns: the title on top, the other
 * values as a two-column label and value grid, badges in a row, actions last.
 */
const AutoCard = <T,>({ columns, row, index }: AutoCardProps<T>) => {
  const colors = useThemeColors();
  const byRole = (role: CardRole) => columns.filter((column, position) => cardRoleOf(column, position) === role);
  const render = (column: Column<T>) => cellContent(column, row, index, NOTHING_HIDDEN);

  const fields = byRole("field");
  const badges = byRole("badge");
  const actions = byRole("actions");

  return (
    <View className="gap-3">
      {byRole("title").map((column) => (
        <View key={column.key}>{render(column)}</View>
      ))}
      {fields.length > 0 ? (
        <View style={styles.grid}>
          {fields.map((column) => (
            <View key={column.key} style={styles.field}>
              <Text style={[TABLE_TEXT.secondary, { color: colors.muted }]}>{column.header}</Text>
              {render(column)}
            </View>
          ))}
        </View>
      ) : null}
      {badges.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {badges.map((column) => (
            <View key={column.key}>{render(column)}</View>
          ))}
        </View>
      ) : null}
      {actions.map((column) => (
        <View key={column.key} className="w-full">
          {render(column)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 12 },
  // Half the card each; flexShrink keeps a long value wrapping inside its half (see rn-flexshrink pitfall).
  field: { width: "50%", flexShrink: 1, gap: 2, paddingRight: 12 },
});

export default AutoCard;
