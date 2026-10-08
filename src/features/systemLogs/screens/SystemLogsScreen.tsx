import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import LogDetailsBottomSheet from "../components/LogDetailsBottomSheet";
import LogSummaryCards from "../components/LogSummaryCards";
import OutcomeFilterChip from "../components/toolbar/OutcomeFilterChip";
import { clearActivitySearch, peekActivitySearch } from "../activitySearchHandoff";
import { useSystemLogsPalette } from "../components/systemLogsTheme";
import { useLogExport } from "../hooks/useLogExport";
import { useLogFilters } from "../hooks/useLogFilters";
import { useLogSelection } from "../hooks/useLogSelection";
import { useSystemLogs } from "../hooks/useSystemLogs";
import { useSystemLogStats } from "../hooks/useSystemLogStats";
import DesktopLogsView from "./DesktopLogsView";
import LogFiltersToolbar from "./LogFiltersToolbar";
import { buildMobileContent } from "./LogsListContent";
import MobileLogsView from "./MobileLogsView";
import { useResponsive } from "@/hooks/useResponsive";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

const SystemLogsScreen = () => {
  const palette = useSystemLogsPalette();
  const { isDesktop } = useResponsive();
  const insets = useRoleScreenInsets();

  // "View activity" hands its search over in memory, never in the URL.
  const [initialSearch] = useState(peekActivitySearch);
  useEffect(clearActivitySearch, []);

  // The count from the last load lets the filters move a page past the end back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const filters = useLogFilters(initialSearch, listTotal);
  const { logs, loading: fetching, refreshing, error, total, totalPages, fetchLogs, refreshLogs } =
    useSystemLogs(filters.params);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (!fetching) setListTotal(total);
  }, [fetching, total]);
  // A page past the end reads as loading until it moves to the new last page, never as "no logs".
  const loading = fetching || (total > 0 && filters.page > totalPages);
  const { stats } = useSystemLogStats();
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(filters.page);

  const selection = useLogSelection(
    logs,
    isDesktop,
    JSON.stringify([
      filters.params.search,
      filters.params.role,
      filters.params.logType,
      filters.params.severity,
      filters.params.outcome,
      filters.dateRange.fromDay,
      filters.dateRange.toDay,
    ])
  );

  const { exporting, exportLogs } = useLogExport(filters.exportParams);

  const retry = () => fetchLogs({ ...filters.params, page: 1 });
  const showingRows = !loading && !error && logs.length > 0;

  const mobileContent = buildMobileContent({
    loading,
    refreshing,
    error,
    logs,
    hasActiveFilters: filters.hasActiveFilters,
    selectedId: selection.selectedLog?._id ?? null,
    onSelect: selection.selectLog,
    onRetry: retry,
  });

  return (
    <View className="flex-1">
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshLogs}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
      >
        <View className="w-full gap-5">
          <LogSummaryCards
            stats={stats}
            isDesktop={isDesktop}
            activeCard={filters.activeCard}
            onSelectCard={filters.showCard}
          />

          <LogFiltersToolbar
            filters={filters}
            isDesktop={isDesktop}
            onExport={() => void exportLogs()}
            exporting={exporting}
          />

          {filters.outcome === "success" ? <OutcomeFilterChip onClear={filters.clearOutcome} /> : null}

          {isDesktop ? (
            <DesktopLogsView
              logs={logs}
              loading={loading}
              refreshing={refreshing}
              error={error}
              hasActiveFilters={filters.hasActiveFilters}
              onRetry={retry}
              selectedLog={selection.selectedLog}
              onSelect={selection.selectLog}
              onClearSelection={selection.clearSelection}
              page={filters.page}
              total={total}
              onPageChange={filters.setPage}
            />
          ) : (
            <MobileLogsView
              content={mobileContent}
              showPagination={showingRows}
              page={filters.page}
              total={total}
              onPageChange={filters.setPage}
            />
          )}
        </View>
      </ScrollView>

      {!isDesktop && (
        <LogDetailsBottomSheet
          visible={selection.sheetVisible}
          log={selection.selectedLog}
          onClose={selection.closeSheet}
        />
      )}
    </View>
  );
};

export default SystemLogsScreen;
