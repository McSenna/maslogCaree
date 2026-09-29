import type { Feather } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type LayoutChangeEvent } from "react-native";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

export type TableColumn<T> = {
  key: string;
  header: string;
  /** Fixed width in px. Columns without one share the remaining width by `flex`. */
  width?: number;
  flex?: number;
  align?: "left" | "right";
  /** Dropped when the table is narrower than this, so the columns that stay are never squeezed. */
  minTableWidth?: number;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  palette: AdminDashboardPalette;
  /** Accessible name of the table, e.g. "Today's queue". */
  caption: string;
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Full spoken summary of a row; also the label when the row is pressable. */
  rowLabel: (row: T) => string;
  onRowPress?: (row: T) => void;
  rowHint?: string;
  /** Phones: each row renders as a stacked block from `renderStacked` instead of columns. */
  stacked?: boolean;
  renderStacked?: (row: T) => ReactNode;
  emptyIcon: keyof typeof Feather.glyphMap;
  emptyMessage: string;
};

const ROW_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });

const Cell = ({
  column,
  semantic,
  children,
}: {
  column: TableColumn<unknown>;
  semantic: boolean;
  children: ReactNode;
}) => (
  <View
    role={semantic ? "cell" : undefined}
    style={{
      width: column.width,
      flex: column.width ? undefined : (column.flex ?? 1),
      minWidth: 0,
      alignItems: column.align === "right" ? "flex-end" : "flex-start",
    }}
  >
    {children}
  </View>
);

const Row = ({
  palette,
  label,
  hint,
  onPress,
  children,
  first,
  stacked,
}: {
  palette: AdminDashboardPalette;
  label: string;
  hint?: string;
  onPress?: () => void;
  children: ReactNode;
  first: boolean;
  stacked: boolean;
}) => {
  const { hovered, pressed, focused, handlers } = useInteractionState({ disabled: !onPress });

  const base = {
    flexDirection: stacked ? ("column" as const) : ("row" as const),
    alignItems: stacked ? ("stretch" as const) : ("center" as const),
    gap: stacked ? 6 : 12,
    paddingHorizontal: stacked ? 4 : 12,
    paddingVertical: stacked ? 12 : 10,
    minHeight: 48,
    borderTopWidth: first ? 0 : 1,
    borderColor: palette.divider,
  };

  if (!onPress) {
    return (
      <View
        role={stacked ? "listitem" : "row"}
        accessible={stacked}
        accessibilityLabel={stacked ? label : undefined}
        style={base}
      >
        {children}
      </View>
    );
  }

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={[
        base,
        {
          borderRadius: 8,
          backgroundColor: hovered || pressed ? palette.hoverBg : "transparent",
          outlineWidth: focused ? 2 : 0,
          outlineStyle: "solid",
          outlineColor: palette.focusRing,
          outlineOffset: -2,
        },
        ROW_WEB,
      ]}
    >
      {children}
    </Pressable>
  );
};

/**
 * The dashboards' one table. Column headers stay in sentence case; numbers align right; columns marked
 * with `minTableWidth` drop out as the card narrows, and phones get stacked rows.
 */
const DataTable = <T,>({
  palette,
  caption,
  columns,
  rows,
  rowKey,
  rowLabel,
  onRowPress,
  rowHint,
  stacked = false,
  renderStacked,
  emptyIcon,
  emptyMessage,
}: DataTableProps<T>) => {
  const [width, setWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) setWidth(next);
  };

  if (rows.length === 0) {
    return <EmptyPanelState palette={palette} icon={emptyIcon} message={emptyMessage} />;
  }

  if (stacked && renderStacked) {
    return (
      <View role={onRowPress ? "group" : "list"} accessibilityLabel={caption} onLayout={onLayout}>
        {rows.map((row, index) => (
          <Row
            key={rowKey(row)}
            palette={palette}
            label={rowLabel(row)}
            hint={rowHint}
            onPress={onRowPress ? () => onRowPress(row) : undefined}
            first={index === 0}
            stacked
          >
            {renderStacked(row)}
          </Row>
        ))}
      </View>
    );
  }

  // Until the first layout pass, assume the widest table so no column flickers out and back in.
  const visible = columns.filter(
    (column) => !column.minTableWidth || width === 0 || width >= column.minTableWidth
  );
  // Interactive rows are announced as buttons with a full summary, so the grid roles are kept for static tables.
  const semantic = !onRowPress;

  return (
    <View role={semantic ? "table" : "group"} accessibilityLabel={caption} onLayout={onLayout}>
      <View
        role={semantic ? "row" : undefined}
        accessibilityElementsHidden={!semantic}
        importantForAccessibility={semantic ? "auto" : "no-hide-descendants"}
        className="flex-row items-center rounded-lg"
        style={{ gap: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: palette.divider }}
      >
        {visible.map((column) => (
          <View
            key={column.key}
            role={semantic ? "columnheader" : undefined}
            style={{
              width: column.width,
              flex: column.width ? undefined : (column.flex ?? 1),
              minWidth: 0,
            }}
          >
            <Text
              className="text-[12px] font-semibold"
              numberOfLines={1}
              style={{ color: palette.muted, textAlign: column.align ?? "left" }}
            >
              {column.header}
            </Text>
          </View>
        ))}
      </View>

      {rows.map((row, index) => (
        <Row
          key={rowKey(row)}
          palette={palette}
          label={rowLabel(row)}
          hint={rowHint}
          onPress={onRowPress ? () => onRowPress(row) : undefined}
          first={index === 0}
          stacked={false}
        >
          {visible.map((column) => (
            <Cell key={column.key} column={column as TableColumn<unknown>} semantic={semantic}>
              {column.render(row)}
            </Cell>
          ))}
        </Row>
      ))}
    </View>
  );
};

export default DataTable;
