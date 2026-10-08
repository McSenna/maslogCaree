import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import PageButton from "./PageButton";
import { buildPageList, pageCountOf, rangeSummary } from "./pageList";
import { TABLE_TEXT } from "./tableTokens";
import type { TablePagination } from "./types";

type PaginationProps = TablePagination & {
  /** Phones: previous and next as 44px buttons around "Page 2 of 5". */
  compact?: boolean;
};

/** The range line and page controls under every paged table. */
const Pagination = ({ page, pageSize, total, onPageChange, noun = "records", compact = false }: PaginationProps) => {
  const colors = useThemeColors();
  const totalPages = pageCountOf(total, pageSize);
  const summary = rangeSummary(page, pageSize, total, noun);
  const goTo = (next: number) => onPageChange(Math.min(totalPages, Math.max(1, next)));
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  if (compact) {
    return (
      <View className="w-full gap-3">
        <Text style={[TABLE_TEXT.cell, styles.center, { color: colors.muted }]}>{summary}</Text>
        <View className="flex-row items-center justify-between gap-2">
          <PageButton
            arrow="prev"
            arrowLabel="Previous"
            accessibilityLabel="Previous page"
            disabled={atStart}
            onPress={() => goTo(page - 1)}
          />
          <Text style={[TABLE_TEXT.button, { color: colors.heading }]}>{`Page ${page} of ${totalPages}`}</Text>
          <PageButton
            arrow="next"
            arrowLabel="Next"
            accessibilityLabel="Next page"
            disabled={atEnd}
            onPress={() => goTo(page + 1)}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="w-full flex-row flex-wrap items-center justify-between gap-3">
      <Text accessibilityLiveRegion="polite" style={[TABLE_TEXT.cell, { color: colors.muted }]}>
        {summary}
      </Text>
      <View role="navigation" accessibilityLabel="Pages" className="flex-row items-center gap-1.5">
        <PageButton arrow="prev" accessibilityLabel="Previous page" disabled={atStart} onPress={() => goTo(page - 1)} />
        {buildPageList(page, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <Text key={`gap-${index}`} style={[TABLE_TEXT.cell, styles.gap, { color: colors.muted }]}>
              …
            </Text>
          ) : (
            <PageButton
              key={entry}
              page={entry}
              current={entry === page}
              accessibilityLabel={`Page ${entry}`}
              onPress={() => goTo(entry)}
            />
          )
        )}
        <PageButton arrow="next" accessibilityLabel="Next page" disabled={atEnd} onPress={() => goTo(page + 1)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  gap: { paddingHorizontal: 4 },
});

export default Pagination;
