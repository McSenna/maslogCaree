import { useState } from "react";
import { RefreshControl, ScrollView, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Pagination from "@/components/ui/Pagination";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import LogDetailsBottomSheet from "../components/LogDetailsBottomSheet";
import LogDetailsPanel from "../components/LogDetailsPanel";
import LogsEmptyState from "../components/LogsEmptyState";
import LogsErrorState from "../components/LogsErrorState";
import LogsTableCard from "../components/LogsTableCard";
import LogSummaryCards from "../components/LogSummaryCards";
import LogToolbar from "../components/LogToolbar";
import { MobileLogCardSkeleton } from "../components/LogsSkeleton";
import MobileLogList from "../components/MobileLogList";
import { useSystemLogsPalette } from "../components/systemLogsTheme";
import { PAGE_SIZE } from "../constants/logsLayout";
import { useLogExport } from "../hooks/useLogExport";
import { useLogFilters } from "../hooks/useLogFilters";
import { useLogSelection } from "../hooks/useLogSelection";
import { useSystemLogs } from "../hooks/useSystemLogs";
import { useSystemLogStats } from "../hooks/useSystemLogStats";

/**
 * System Logs — the admin's audit trail.
 *
 * Read-only by design: entries are written by the server as things happen and
 * are never edited here. Desktop shows the table beside a details column;
 * a phone gets cards and a bottom sheet.
 */
export default function SystemLogsScreen() {
  const palette = useSystemLogsPalette();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useRoleScreenInsets();
  const isDesktop = windowWidth >= BREAKPOINTS.desktop;

  const { search: searchParam } = useLocalSearchParams<{ search?: string | string[] }>();
  const initialSearch = (Array.isArray(searchParam) ? searchParam[0] : searchParam) ?? "";

  // Measured width of the table area, so the table can stretch to fill the left
  // column and only scroll once it drops below its minimum.
  const [tableAreaWidth, setTableAreaWidth] = useState(0);

  const filters = useLogFilters(initialSearch);
  const { logs, loading, refreshing, error, total, totalPages, fetchLogs, refreshLogs } =
    useSystemLogs(filters.params);
  const { stats } = useSystemLogStats();

  const selection = useLogSelection(
    logs,
    isDesktop,
    // A new result set gets a fresh auto-selection.
    JSON.stringify([
      filters.params.search,
      filters.params.role,
      filters.params.logType,
      filters.params.severity,
      filters.dateRange.fromDate,
      filters.dateRange.toDate,
    ])
  );

  const { exporting, exportLogs } = useLogExport(filters.exportParams);

  const retry = () => fetchLogs({ ...filters.params, page: 1 });
  const showingRows = !loading && !error && logs.length > 0;

  const fallback = error ? (
    <LogsErrorState message={error} onRetry={retry} bare />
  ) : (
    <LogsEmptyState hasFilters={filters.hasActiveFilters} bare />
  );

  const mobileContent =
    loading && !refreshing ? (
      <MobileLogCardSkeleton count={Math.min(PAGE_SIZE, 6)} />
    ) : error ? (
      <LogsErrorState message={error} onRetry={retry} />
    ) : logs.length === 0 ? (
      <LogsEmptyState hasFilters={filters.hasActiveFilters} />
    ) : (
      <MobileLogList
        logs={logs}
        selectedId={selection.selectedLog?._id ?? null}
        onSelect={selection.selectLog}
      />
    );

  return (
    <View className="flex-1">
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
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
          <LogSummaryCards stats={stats} isDesktop={isDesktop} />

          <LogToolbar
            search={filters.searchInput}
            onSearchChange={filters.setSearchInput}
            datePreset={filters.datePreset}
            onDatePresetChange={filters.setDatePreset}
            dateRangeLabel={filters.dateRangeLabel}
            customFrom={filters.customFrom}
            customTo={filters.customTo}
            onCustomFromChange={filters.setCustomFrom}
            onCustomToChange={filters.setCustomTo}
            role={filters.role}
            onRoleChange={filters.setRole}
            logType={filters.logType}
            onLogTypeChange={filters.setLogType}
            severity={filters.severity}
            onSeverityChange={filters.setSeverity}
            isDesktop={isDesktop}
            onExport={() => void exportLogs()}
            exporting={exporting}
          />

          {isDesktop ? (
            <View className="w-full flex-row items-start gap-4">
              <View style={{ flex: 76, minWidth: 0 }}>
                <LogsTableCard
                  logs={logs}
                  loading={loading}
                  refreshing={refreshing}
                  fallback={fallback}
                  showFallback={Boolean(error) || logs.length === 0}
                  selectedId={selection.selectedLog?._id ?? null}
                  onSelect={selection.selectLog}
                  tableAreaWidth={tableAreaWidth}
                  onTableAreaWidth={setTableAreaWidth}
                  showPagination={showingRows}
                  page={filters.page}
                  totalPages={totalPages}
                  total={total}
                  onPageChange={filters.setPage}
                />
              </View>
              <View style={{ flex: 24, minWidth: 300 }}>
                <LogDetailsPanel log={selection.selectedLog} onClose={selection.clearSelection} />
              </View>
            </View>
          ) : (
            <>
              {mobileContent}
              {showingRows ? (
                <Pagination
                  page={filters.page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={PAGE_SIZE}
                  isDesktop={false}
                  noun="logs"
                  onPageChange={filters.setPage}
                />
              ) : null}
            </>
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
}
