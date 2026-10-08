import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import { planColumns } from "./columnLayout";
import MobileCardList from "./MobileCardList";
import Pagination from "./Pagination";
import TableEmptyState from "./TableEmptyState";
import TableErrorState from "./TableErrorState";
import TableGrid from "./TableGrid";
import { TABLE_INSET } from "./tableTokens";
import type { DataTableProps } from "./types";

type DataView = "loading" | "error" | "empty" | "rows";

const viewOf = (loading: boolean, error: string | null | undefined, count: number): DataView => {
  if (count > 0) return "rows";
  if (error) return "error";
  return loading ? "loading" : "empty";
};

/**
 * The app's one data table. Columns are declared once; the header, every row,
 * the loading skeleton and the phone cards are all drawn from that list.
 */
const DataTable = <T,>(props: DataTableProps<T>) => {
  const { columns, data, caption, loading = false, refreshing = false, error, pagination, footer, toolbar } = props;
  const { layout = "auto", surface = "card", density = "regular", rowPressMode = "button", debug = false } = props;
  const colors = useThemeColors();
  const { width: windowWidth, isMobile } = useResponsive();
  const [outerWidth, setOuterWidth] = useState(0);

  // Measured on the outermost view, which is the same width in table and card layouts, so switching never loops.
  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== outerWidth) setOuterWidth(next);
  };

  const plain = surface === "plain";
  const tableWidth = outerWidth > 0 && !plain ? outerWidth - 2 * (TABLE_INSET + 1) : outerWidth;
  const plan = planColumns(columns, windowWidth, tableWidth);
  // Below 768px, or when even the essential columns would need a sideways scroll, auto shows cards:
  // the app hides scrollbars, so a scrolling table would read as clipped.
  const cards = layout === "cards" || (layout === "auto" && (isMobile || plan.scrolls));
  const view = viewOf(loading, error, data.length);
  const showPages = view === "rows" && pagination !== undefined && pagination.total > 0;
  const hasFooter = view === "rows" && (showPages || footer !== undefined);
  const chrome = plain ? null : [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];

  const state =
    view === "error" ? (
      <TableErrorState
        title={props.errorTitle ?? `Could not load ${caption.toLowerCase()}.`}
        message={error}
        onRetry={props.onRetry}
      />
    ) : view === "empty" ? (
      <TableEmptyState
        icon={props.emptyIcon}
        title={props.emptyTitle ?? `No ${caption.toLowerCase()} yet`}
        description={props.emptyDescription}
        action={props.emptyAction}
      />
    ) : null;

  const body = cards ? (
    view === "rows" || view === "loading" ? (
      <MobileCardList {...props} data={data} plain={plain} loading={view === "loading"} />
    ) : (
      <View style={chrome}>{state}</View>
    )
  ) : (
    <View style={chrome}>
      {toolbar ? <View style={styles.toolbar}>{toolbar}</View> : null}
      <View>
        {state ?? (
          <TableGrid
            {...props}
            plan={plan}
            loading={view === "loading"}
            refreshing={refreshing}
            pressMode={rowPressMode}
            density={density}
            lastDivided={hasFooter}
            debug={debug}
          />
        )}
      </View>
      {hasFooter ? <View style={styles.footer}>{showPages ? <Pagination {...pagination} /> : footer}</View> : null}
    </View>
  );

  if (!cards) return <View onLayout={onLayout}>{body}</View>;
  return (
    <View className="gap-3" onLayout={onLayout}>
      {toolbar}
      {body}
      {hasFooter ? (
        <View style={styles.footer}>{showPages ? <Pagination {...pagination} compact /> : footer}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: RADII.large,
    padding: TABLE_INSET,
    overflow: "hidden",
  },
  toolbar: { paddingBottom: TABLE_INSET },
  footer: { paddingTop: 16, paddingHorizontal: 4 },
});

export default DataTable;
