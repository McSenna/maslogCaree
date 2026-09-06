import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Screen from "@/components/layout/Screen";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useSystemLogs } from "@/hooks/useSystemLogs";
import {
  formatSystemLogAction,
  formatSystemLogDate,
  normalizeRoleLabel,
  systemLogActions,
  type SystemLog,
} from "@/services/systemLogService";

const ROLE_OPTIONS = ["all", "admin", "doctor", "midwife", "bhw", "resident"];
const PLATFORM_OPTIONS = ["all", "Web", "Android", "iOS"];
const ACTION_OPTIONS = systemLogActions.filter((option) => option !== "ALL");
const DATE_OPTIONS = [
  "all",
  "today",
  "yesterday",
  "7d",
  "30d",
  "custom",
] as const;

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildDateRange(preset: string, fromCustom: string, toCustom: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (preset === "today") {
    return {
      fromDate: toDateString(today),
      toDate: toDateString(new Date(today.getTime() + 86400000)),
    };
  }

  if (preset === "yesterday") {
    const from = new Date(today.getTime() - 86400000);
    const to = new Date(today.getTime());
    return {
      fromDate: toDateString(from),
      toDate: toDateString(to),
    };
  }

  if (preset === "7d") {
    const from = new Date(today.getTime() - 6 * 86400000);
    return {
      fromDate: toDateString(from),
      toDate: toDateString(new Date(today.getTime() + 86400000)),
    };
  }

  if (preset === "30d") {
    const from = new Date(today.getTime() - 29 * 86400000);
    return {
      fromDate: toDateString(from),
      toDate: toDateString(new Date(today.getTime() + 86400000)),
    };
  }

  if (preset === "custom") {
    return {
      fromDate: fromCustom || undefined,
      toDate: toCustom || undefined,
    };
  }

  return {};
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "items-center gap-3 rounded-2xl border p-8",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Feather name="activity" size={22} color="#94a3b8" />
      </View>
      <View className="items-center gap-1">
        <Text className={`text-base font-semibold ${classes.textPrimary}`}>
          {hasFilters ? "No matching activity found" : "No system activity found"}
        </Text>
        <Text className={`text-center text-xs ${classes.textMuted}`}>
          {hasFilters
            ? "Try adjusting your search or filter criteria."
            : "There are no logs yet for the current system activity."}
        </Text>
      </View>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "items-center gap-4 rounded-2xl border p-8",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-rose-100">
        <Feather name="alert-circle" size={22} color="#f43f5e" />
      </View>
      <View className="items-center gap-1">
        <Text className={`text-sm font-semibold ${classes.textPrimary}`}>
          Unable to load system logs.
        </Text>
        <Text className={`text-center text-xs ${classes.textMuted}`}>{message}</Text>
      </View>
      <Pressable onPress={onRetry} className="rounded-xl bg-mc-primary px-5 py-2.5">
        <Text className="text-sm font-semibold text-white">Retry</Text>
      </Pressable>
    </View>
  );
}

function DropdownSelect({
  label,
  value,
  options,
  onChange,
  open,
  onToggle,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (nextValue: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const displayValue = value === "all" ? `All ${label}` : value;

  return (
    <View className="relative">
      <Pressable
        onPress={onToggle}
        className={[
          "flex-row items-center justify-between gap-2 rounded-xl border px-3 py-2.5 min-w-[170px]",
          isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
        ].join(" ")}
      >
        <Text className={isDark ? "text-sm font-medium text-slate-100" : "text-sm font-medium text-slate-700"}>
          {displayValue}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={14} color={isDark ? "#cbd5e1" : "#475569"} />
      </Pressable>

      {open && (
        <View
          className={[
            "absolute left-0 top-[calc(100%+8px)] z-20 w-[220px] rounded-xl border p-1 shadow-lg",
            isDark ? "border-slate-700 bg-slate-950 shadow-slate-950/50" : "border-slate-200 bg-white shadow-slate-200/80",
          ].join(" ")}
        >
          <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled>
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onChange(option);
                  onToggle();
                }}
                className={[
                  "rounded-lg px-3 py-2",
                  value === option ? "bg-mc-primary/10" : "",
                ].join(" ")}
              >
                <Text
                  className={[
                    value === option ? "font-semibold text-mc-primary" : "text-slate-600",
                    isDark && value !== option ? "text-slate-200" : "",
                    "text-sm",
                  ].join(" ")}
                >
                  {option === "all" ? `All ${label}` : option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function TableRow({ log }: { log: SystemLog }) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "flex-row items-center border-b px-4 py-4",
        isDark ? "border-slate-800" : "border-slate-200",
      ].join(" ")}
      style={{ width: "100%" }}
    >
      <View style={{ width: "22%", minWidth: 180 }} className="pr-3">
        <Text className={`text-[15px] ${classes.textSecondary}`}>{formatSystemLogDate(log.createdAt)}</Text>
      </View>
      <View style={{ width: "25%", minWidth: 180 }} className="pr-3">
        <Text className={`text-[15px] font-semibold ${classes.textPrimary}`}>{formatSystemLogAction(log.action)}</Text>
      </View>
      <View style={{ width: "15%", minWidth: 110 }} className="pr-3">
        <View className="self-start rounded-full bg-sky-500/10 px-2.5 py-1">
          <Text className="text-[11px] font-semibold uppercase tracking-wide text-sky-600">
            {normalizeRoleLabel(log.role)}
          </Text>
        </View>
      </View>
      <View style={{ width: "20%", minWidth: 150 }} className="pr-3">
        <Text className={`text-[15px] ${classes.textSecondary}`}>{log.ipAddress || "unknown"}</Text>
      </View>
      <View style={{ width: "18%", minWidth: 110 }}>
        <Text className={`text-[15px] ${classes.textSecondary}`}>{log.platform || "Web"}</Text>
      </View>
    </View>
  );
}

export default function AdminSystemLogs() {
  const { classes, resolvedTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isDark = resolvedTheme === "dark";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<"role" | "action" | "platform" | "date" | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 25,
      search: search.trim() || undefined,
      role: roleFilter === "all" ? undefined : roleFilter,
      action: actionFilter === "all" ? undefined : actionFilter,
      platform: platformFilter === "all" ? undefined : platformFilter,
      sort: sortOrder,
      ...buildDateRange(dateRange, customFrom, customTo),
    }),
    [actionFilter, customFrom, customTo, dateRange, page, platformFilter, roleFilter, search, sortOrder]
  );

  const { logs, loading, refreshing, error, total, totalPages, fetchLogs, refreshLogs } = useSystemLogs(params);

  const hasActiveFilters =
    search.trim().length > 0 ||
    roleFilter !== "all" ||
    actionFilter !== "all" ||
    platformFilter !== "all" ||
    dateRange !== "30d" ||
    customFrom.length > 0 ||
    customTo.length > 0;

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setActionFilter("all");
    setPlatformFilter("all");
    setDateRange("all");
    setCustomFrom("");
    setCustomTo("");
    setPage(1);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshLogs}
      tintColor={isDark ? "#38bdf8" : "#2A7DE1"}
      colors={["#2A7DE1"]}
    />
  );

  return (
    <Screen fullWidth>
      <View className="w-full gap-5 pb-6">
        <View className="w-full">
          <View className="w-full flex-row items-end justify-between gap-4">
            <View className="flex-1">
              <PageTitle>System Logs</PageTitle>
              <PageSubtitle>Monitor and review user activity across the system.</PageSubtitle>
            </View>

            <View
              className={[
                "flex-row items-center gap-3 rounded-xl border px-3 py-2.5",
                isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                "w-full max-w-[420px]",
              ].join(" ")}
            >
              <Feather name="search" size={16} color="#64748b" />
              <TextInput
                value={search}
                onChangeText={(next) => {
                  setSearch(next);
                  setPage(1);
                }}
                placeholder="Search actions, roles, IPs"
                placeholderTextColor="#94a3b8"
                className={`flex-1 text-sm ${classes.textPrimary}`}
              />
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap items-center gap-2">
            <DropdownSelect
              label="Roles"
              value={roleFilter}
              options={ROLE_OPTIONS}
              open={openDropdown === "role"}
              onToggle={() => setOpenDropdown(openDropdown === "role" ? null : "role")}
              onChange={(next) => { setRoleFilter(next); setPage(1); }}
            />
            <DropdownSelect
              label="Actions"
              value={actionFilter}
              options={ACTION_OPTIONS}
              open={openDropdown === "action"}
              onToggle={() => setOpenDropdown(openDropdown === "action" ? null : "action")}
              onChange={(next) => { setActionFilter(next); setPage(1); }}
            />
            <DropdownSelect
              label="Platforms"
              value={platformFilter}
              options={PLATFORM_OPTIONS}
              open={openDropdown === "platform"}
              onToggle={() => setOpenDropdown(openDropdown === "platform" ? null : "platform")}
              onChange={(next) => { setPlatformFilter(next); setPage(1); }}
            />
            <DropdownSelect
              label="Date Range"
              value={dateRange}
              options={DATE_OPTIONS as unknown as readonly string[]}
              open={openDropdown === "date"}
              onToggle={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
              onChange={(next) => { setDateRange(next); setPage(1); }}
            />

            <Pressable
              onPress={clearFilters}
              className={[
                "ml-auto rounded-xl border px-3 py-2.5",
                isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <Text className={isDark ? "text-sm font-medium text-slate-200" : "text-sm font-medium text-slate-700"}>
                Clear Filters
              </Text>
            </Pressable>
          </View>

          {dateRange === "custom" && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              <TextInput
                value={customFrom}
                onChangeText={(text) => {
                  setCustomFrom(text);
                  setPage(1);
                }}
                placeholder="From (YYYY-MM-DD)"
                placeholderTextColor="#94a3b8"
                className={[
                  "w-[220px] rounded-xl border px-3 py-2 text-sm",
                  isDark ? "border-slate-700 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-900",
                ].join(" ")}
              />
              <TextInput
                value={customTo}
                onChangeText={(text) => {
                  setCustomTo(text);
                  setPage(1);
                }}
                placeholder="To (YYYY-MM-DD)"
                placeholderTextColor="#94a3b8"
                className={[
                  "w-[220px] rounded-xl border px-3 py-2 text-sm",
                  isDark ? "border-slate-700 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-900",
                ].join(" ")}
              />
            </View>
          )}
        </View>

        <View className="w-full flex-row items-center justify-between gap-2">
          <Text className={`text-sm ${classes.textMuted}`}>
            Showing {logs.length} of {total} logs
          </Text>
          <Pressable
            onPress={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2"
          >
            <Text className="text-xs font-semibold text-slate-700">
              {sortOrder === "desc" ? "Newest first" : "Oldest first"}
            </Text>
          </Pressable>
        </View>

        {loading && !refreshing ? (
          <View className="items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
            <ActivityIndicator size="small" color="#2A7DE1" />
            <Text className="mt-3 text-sm text-slate-500">Loading system logs…</Text>
          </View>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchLogs({ ...params, page: 1 })} />
        ) : logs.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} />
        ) : isDesktop ? (
          <View
            className={[
              "w-full overflow-hidden rounded-2xl border",
              classes.border,
              isDark ? "bg-slate-900/70" : "bg-white",
            ].join(" ")}
            style={{ width: "100%" }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} refreshControl={refreshControl}>
              <View style={{ width: "100%", minWidth: 980 }}>
                <View
                  className={[
                    "flex-row items-center border-b px-4 py-3 gap-40",
                    isDark ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50",
                  ].join(" ")}
                  style={{ width: "100%" }}
                >
                  <Text style={{ width: "22%", minWidth: 180 }} className="pr-3 text-[15px] font-bold uppercase tracking-wide text-slate-500">
                    Date & Time
                  </Text>
                  <Text style={{ width: "25%", minWidth: 200 }} className="pr-3 text-[15px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </Text>
                  <Text style={{ width: "15%", minWidth: 110 }} className="pr-3 text-[15px] font-bold uppercase tracking-wide text-slate-500">
                    Role
                  </Text>
                  <Text style={{ width: "20%", minWidth: 170 }} className="pr-3 text-[15px] font-bold uppercase tracking-wide text-slate-500">
                    Device IP
                  </Text>
                  <Text style={{ width: "18%", minWidth: 120 }} className="text-[15px] font-bold uppercase tracking-wide text-slate-500">
                    Platform
                  </Text>
                </View>
                {logs.map((log) => (
                  <TableRow key={log._id} log={log} />
                ))}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View className="w-full gap-40">
            {logs.map((log) => (
              <View
                key={log._id}
                className={[
                  "w-full rounded-2xl border p-4 gap- 40",
                  classes.border,
                  isDark ? "bg-slate-900/70" : "bg-white",
                ].join(" ")}
              >
                <View className="mb-2 flex-row items-center justify-between gap-2">
                  <Text className={`text-sm font-semibold ${classes.textPrimary}`}>
                    {formatSystemLogAction(log.action)}
                  </Text>
                  <View className="rounded-full bg-sky-500/10 px-2 py-1">
                    <Text className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">
                      {normalizeRoleLabel(log.role)}
                    </Text>
                  </View>
                </View>
                <View className="gap-1 text-xs">
                  <Text className={`text-xs ${classes.textSecondary}`}>Date & Time: {formatSystemLogDate(log.createdAt)}</Text>
                  <Text className={`text-xs ${classes.textSecondary}`}>Device IP: {log.ipAddress || "unknown"}</Text>
                  <Text className={`text-xs ${classes.textSecondary}`}>Platform: {log.platform || "Web"}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {totalPages > 1 && (
          <View className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
            <Text className="text-xs font-medium text-slate-500">Page {page} of {totalPages}</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                disabled={page <= 1}
                onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                className={[
                  "rounded-lg px-3 py-2",
                  page <= 1 ? "bg-slate-100" : "bg-slate-200",
                ].join(" ")}
              >
                <Text className={page <= 1 ? "text-xs text-slate-400" : "text-xs font-medium text-slate-700"}>Prev</Text>
              </Pressable>
              <Pressable
                disabled={page >= totalPages}
                onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className={[
                  "rounded-lg px-3 py-2",
                  page >= totalPages ? "bg-slate-100" : "bg-slate-200",
                ].join(" ")}
              >
                <Text className={page >= totalPages ? "text-xs text-slate-400" : "text-xs font-medium text-slate-700"}>Next</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
