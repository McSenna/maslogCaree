import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
import {
  type DatePreset,
  LogDetailsBottomSheet,
  LogDetailsPanel,
  LogSummaryCards,
  LogToolbar,
  LogsTable,
  LogsTableSkeleton,
  MobileLogCardSkeleton,
  MobileLogList,
  buildDateRange,
  formatDateRangeLabel,
  DEFAULT_DATE_PRESET,
  CARD_SHADOW,
  RADIUS,
  LOGS_TABLE_MIN_WIDTH,
  useSystemLogsPalette,
} from "@/components/systemLogs";
// The footer is the User Management pagination itself, not a copy of it.
import UsersPagination from "@/components/users/UsersPagination";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useSystemLogStats } from "@/hooks/useSystemLogStats";
import { useSystemLogs } from "@/hooks/useSystemLogs";
import { exportSystemLogs, type SystemLog } from "@/services/systemLogService";

const SEARCH_DEBOUNCE_MS = 350;
const PAGE_SIZE = 8;

/** `bare` drops the card, for when the table container already provides one. */
function LogsEmptyState({ hasFilters, bare = false }: { hasFilters: boolean; bare?: boolean }) {
  const palette = useSystemLogsPalette();

  return (
    <View
      className={`items-center gap-3 p-10 ${bare ? "" : "rounded-2xl border"}`}
      style={bare ? undefined : { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.iconWell }}
      >
        <Feather name="activity" size={20} color={palette.subtle} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-sm font-semibold" style={{ color: palette.heading }}>
          {hasFilters ? "No logs match your search." : "No system logs found."}
        </Text>
        <Text className="text-center text-xs" style={{ color: palette.muted }}>
          {hasFilters
            ? "Try adjusting your filters or search terms."
            : "There are currently no activity records to display."}
        </Text>
      </View>
    </View>
  );
}

function LogsErrorState({
  message,
  onRetry,
  bare = false,
}: { message: string; onRetry: () => void; bare?: boolean }) {
  const palette = useSystemLogsPalette();
  const errorTone = palette.severity.error;

  return (
    <View
      className={`items-center gap-3 p-10 ${bare ? "" : "rounded-2xl border"}`}
      style={bare ? undefined : { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: errorTone.bg }}>
        <Feather name="alert-circle" size={20} color={errorTone.dot} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-sm font-semibold" style={{ color: palette.heading }}>
          Unable to load system logs.
        </Text>
        <Text className="text-center text-xs" style={{ color: palette.muted }}>
          {message}
        </Text>
      </View>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        className="h-11 justify-center rounded-xl px-5"
        style={{ backgroundColor: palette.primary }}
      >
        <Text className="text-sm font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

export default function AdminSystemLogs() {
  const palette = useSystemLogsPalette();
  const { width: windowWidth } = useWindowDimensions();

  const { search: searchParam } = useLocalSearchParams<{ search?: string | string[] }>();
  const initialSearch = (Array.isArray(searchParam) ? searchParam[0] : searchParam) ?? "";

  // Same breakpoint the shell uses to swap the sidebar for the bottom nav, so
  // the page and its chrome never disagree about which layout is showing.
  const isMobile = windowWidth < BREAKPOINTS.tablet;
  const isDesktop = windowWidth >= BREAKPOINTS.desktop;

  // Spacing this page wants from the edge of the content area, minus what the
  // shell already applies — mirrors the admin dashboard so the two pages line
  // up under the header and against the sidebar.
  const layoutPadding = isMobile ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
  const gutter = Math.max(0, (isMobile ? 16 : windowWidth >= 1024 ? 32 : 24) - layoutPadding.horizontal);
  const paddingTop = Math.max(0, (isMobile ? 16 : 24) - layoutPadding.top);
  const paddingBottom = Math.max(0, (isMobile ? 28 : 32) - layoutPadding.bottom);

  // Measured width of the table area, so the table can stretch to fill the left
  // column and only scroll once it drops below its minimum.
  const [tableAreaWidth, setTableAreaWidth] = useState(0);

  // Seeded from the route so "View Activity Logs" on a user can land here
  // already narrowed to that account. Read once, as the initial value: the
  // search box stays the admin's to clear, and re-applying the parameter on
  // every render would fight them for it.
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  // The date filter opens on "All Time": an audit trail is most useful when it
  // starts by showing everything it holds, and any narrower default silently
  // hides older entries from an admin who never opened the filter.
  const [datePreset, setDatePreset] = useState<DatePreset>(DEFAULT_DATE_PRESET);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [role, setRole] = useState("all");
  const [logType, setLogType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  const hasAutoSelectedRef = useRef(false);

  // Debounce free-text search so it doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const dateRange = useMemo(() => buildDateRange(datePreset, customFrom, customTo), [datePreset, customFrom, customTo]);
  const dateRangeLabel = useMemo(
    () => formatDateRangeLabel(datePreset, dateRange.fromDate, dateRange.toDate),
    [datePreset, dateRange]
  );

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      role: role === "all" ? undefined : role,
      logType: logType === "all" ? undefined : logType,
      severity: severity === "all" ? undefined : severity,
      sort: "desc" as const,
      ...dateRange,
    }),
    [page, search, role, logType, severity, dateRange]
  );

  const { logs, loading, refreshing, error, total, totalPages, fetchLogs, refreshLogs } = useSystemLogs(params);
  const { stats } = useSystemLogStats();

  const hasActiveFilters =
    search.length > 0 || role !== "all" || logType !== "all" || severity !== "all" || datePreset !== DEFAULT_DATE_PRESET;

  // Desktop opens straight to the first row's details, matching the reference
  // layout; mobile only opens the sheet once a card is tapped.
  useEffect(() => {
    if (!isDesktop) return;
    if (hasAutoSelectedRef.current) return;
    if (logs.length > 0) {
      setSelectedLog(logs[0]);
      hasAutoSelectedRef.current = true;
    }
  }, [isDesktop, logs]);

  useEffect(() => {
    hasAutoSelectedRef.current = false;
  }, [search, role, logType, severity, dateRange.fromDate, dateRange.toDate]);

  const handleSelectLog = (log: SystemLog) => {
    setSelectedLog(log);
    if (!isDesktop) setSheetVisible(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportSystemLogs({
        search: search || undefined,
        role: role === "all" ? undefined : role,
        logType: logType === "all" ? undefined : logType,
        severity: severity === "all" ? undefined : severity,
        sort: "desc",
        ...dateRange,
      });
    } catch {
      Alert.alert("Export failed", "Failed to export system logs. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const showingRows = !loading && !error && logs.length > 0;

  /**
   * Desktop: table and pagination inside one white section, the same structure
   * User Management uses. The toolbar stays outside it here because on this
   * page it spans the table and the details panel together.
   */
  const tableCard = (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      {loading && !refreshing ? (
        <LogsTableSkeleton rows={PAGE_SIZE} />
      ) : error ? (
        <LogsErrorState message={error} onRetry={() => fetchLogs({ ...params, page: 1 })} bare />
      ) : logs.length === 0 ? (
        <LogsEmptyState hasFilters={hasActiveFilters} bare />
      ) : (
        // Below LOGS_TABLE_MIN_WIDTH the nine columns cramp, so the table keeps
        // its proportions and scrolls sideways instead of squeezing. At or above
        // it the table takes the full card width and the scroll never engages.
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) setTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(tableAreaWidth, LOGS_TABLE_MIN_WIDTH) }}>
              <LogsTable logs={logs} selectedId={selectedLog?._id ?? null} onSelect={handleSelectLog} />
            </View>
          </ScrollView>
        </View>
      )}

      {showingRows ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <UsersPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            isDesktop
            noun="logs"
            onPageChange={setPage}
          />
        </View>
      ) : null}
    </View>
  );

  const mobileContent =
    loading && !refreshing ? (
      <MobileLogCardSkeleton count={Math.min(PAGE_SIZE, 6)} />
    ) : error ? (
      <LogsErrorState message={error} onRetry={() => fetchLogs({ ...params, page: 1 })} />
    ) : logs.length === 0 ? (
      <LogsEmptyState hasFilters={hasActiveFilters} />
    ) : (
      <MobileLogList logs={logs} selectedId={selectedLog?._id ?? null} onSelect={handleSelectLog} />
    );

  return (
    <View className="flex-1">
      {/* The page tint runs edge to edge behind the shell's padding, the same
          way the admin dashboard paints it, so the sidebar and header meet
          this page without a seam. Positioned rather than negatively
          margined so it cannot feed back into the shell's flex row. */}
      <View
        style={{
          position: "absolute",
          top: -layoutPadding.top,
          bottom: -layoutPadding.bottom,
          left: -layoutPadding.horizontal,
          right: -layoutPadding.horizontal,
          backgroundColor: palette.pageBg,
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: gutter, paddingTop, paddingBottom }}
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
            search={searchInput}
            onSearchChange={setSearchInput}
            datePreset={datePreset}
            onDatePresetChange={(preset) => {
              setDatePreset(preset);
              setPage(1);
            }}
            dateRangeLabel={dateRangeLabel}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={(v) => {
              setCustomFrom(v);
              setPage(1);
            }}
            onCustomToChange={(v) => {
              setCustomTo(v);
              setPage(1);
            }}
            role={role}
            onRoleChange={(v) => {
              setRole(v);
              setPage(1);
            }}
            logType={logType}
            onLogTypeChange={(v) => {
              setLogType(v);
              setPage(1);
            }}
            severity={severity}
            onSeverityChange={(v) => {
              setSeverity(v);
              setPage(1);
            }}
            isDesktop={isDesktop}
            onExport={handleExport}
            exporting={exporting}
          />

          {isDesktop ? (
            <View className="w-full flex-row items-start gap-4">
              <View style={{ flex: 76, minWidth: 0 }}>{tableCard}</View>
              <View style={{ flex: 24, minWidth: 300 }}>
                <LogDetailsPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
              </View>
            </View>
          ) : (
            <>
              {mobileContent}
              {showingRows ? (
                <UsersPagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={PAGE_SIZE}
                  isDesktop={false}
                  noun="logs"
                  onPageChange={setPage}
                />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      {!isDesktop && (
        <LogDetailsBottomSheet visible={sheetVisible} log={selectedLog} onClose={() => setSheetVisible(false)} />
      )}
    </View>
  );
}
