import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import LogDetailsBottomSheet from "../components/LogDetailsBottomSheet";
import LogSummaryCards from "../components/LogSummaryCards";
import { useSystemLogsPalette } from "../components/systemLogsTheme";
import { useLogExport } from "../hooks/useLogExport";
import { useLogFilters } from "../hooks/useLogFilters";
import { useLogSelection } from "../hooks/useLogSelection";
import { useSystemLogs } from "../hooks/useSystemLogs";
import { useSystemLogStats } from "../hooks/useSystemLogStats";
import DesktopLogsView from "./DesktopLogsView";
import LogFiltersToolbar from "./LogFiltersToolbar";
import { buildFallback, buildMobileContent } from "./LogsListContent";
import MobileLogsView from "./MobileLogsView";
import { useResponsive } from "@/hooks/useResponsive";

const SystemLogsScreen = () => {
  const palette = useSystemLogsPalette();
  const { isDesktop } = useResponsive();
  const insets = useRoleScreenInsets();

  const { search: searchParam } = useLocalSearchParams<{ search?: string | string[] }>();
  const initialSearch = (Array.isArray(searchParam) ? searchParam[0] : searchParam) ?? "";

  const [tableAreaWidth, setTableAreaWidth] = useState(0);

  const filters = useLogFilters(initialSearch);
  const { logs, loading, refreshing, error, total, totalPages, fetchLogs, refreshLogs } =
    useSystemLogs(filters.params);
  const { stats } = useSystemLogStats();

  const selection = useLogSelection(
    logs,
    isDesktop,
    JSON.stringify([
      filters.params.search,
      filters.params.role,
      filters.params.logType,
      filters.params.severity,
      filters.dateRange.fromDay,
      filters.dateRange.toDay,
    ])
  );

  const { exporting, exportLogs } = useLogExport(filters.exportParams);

  const retry = () => fetchLogs({ ...filters.params, page: 1 });
  const showingRows = !loading && !error && logs.length > 0;

  const fallback = buildFallback(error, filters.hasActiveFilters, retry);
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

          <LogFiltersToolbar
            filters={filters}
            isDesktop={isDesktop}
            onExport={() => void exportLogs()}
            exporting={exporting}
          />

          {isDesktop ? (
            <DesktopLogsView
              logs={logs}
              loading={loading}
              refreshing={refreshing}
              fallback={fallback}
              showFallback={Boolean(error) || logs.length === 0}
              selectedLog={selection.selectedLog}
              onSelect={selection.selectLog}
              onClearSelection={selection.clearSelection}
              tableAreaWidth={tableAreaWidth}
              onTableAreaWidth={setTableAreaWidth}
              showPagination={showingRows}
              page={filters.page}
              totalPages={totalPages}
              total={total}
              onPageChange={filters.setPage}
            />
          ) : (
            <MobileLogsView
              content={mobileContent}
              showPagination={showingRows}
              page={filters.page}
              totalPages={totalPages}
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
