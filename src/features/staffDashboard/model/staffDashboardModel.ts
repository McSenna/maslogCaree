/**
 * Filtering and aggregation behind the staff dashboard's period and service filters. Import-free (types
 * are declared structurally) so `node --test` can load it without the `@/` alias.
 */

export type StaffPeriod = "7d" | "30d";

export const PERIOD_DAYS: Record<StaffPeriod, number> = { "7d": 7, "30d": 30 };

export const ALL_SERVICES = "all";

type ServiceRef = { key: string; label: string };

type TrendPointLike = {
  key: string;
  label: string;
  date: string;
  count: number;
  byService: Record<string, number>;
};

type AppointmentLike = { consultationType: string; status: string; isUrgent: boolean };

type ActivityLike = { serviceType: string };

export type PeriodPoint = { key: string; label: string; date: string; value: number };

export type PeriodSummary = {
  points: PeriodPoint[];
  total: number;
  previousTotal: number;
  /** Rounded percent change against the previous window of the same length; null when there is no baseline. */
  changePercent: number | null;
};

const countFor = (point: TrendPointLike, service: string): number =>
  service === ALL_SERVICES ? point.count : (point.byService[service] ?? 0);

/** The trailing window for a period, counted for one service or all of them, with the window before it for comparison. */
export const summarizePeriod = (
  trend: TrendPointLike[],
  period: StaffPeriod,
  service: string = ALL_SERVICES
): PeriodSummary => {
  const days = PERIOD_DAYS[period];
  const current = trend.slice(-days);
  const previous = trend.slice(-days * 2, -days);

  const points = current.map((point) => ({
    key: point.key,
    label: point.label,
    date: point.date,
    value: countFor(point, service),
  }));
  const total = points.reduce((sum, point) => sum + point.value, 0);
  const previousTotal = previous.reduce((sum, point) => sum + countFor(point, service), 0);

  const changePercent =
    previous.length === 0 || previousTotal === 0
      ? null
      : Math.round(((total - previousTotal) / previousTotal) * 100);

  return { points, total, previousTotal, changePercent };
};

export type ServiceShare = ServiceRef & { count: number; percent: number };

/** Completed visits per service over the period, largest first; percents are of the period total. */
export const serviceShares = (
  trend: TrendPointLike[],
  period: StaffPeriod,
  services: ServiceRef[]
): ServiceShare[] => {
  const window = trend.slice(-PERIOD_DAYS[period]);
  const rows = services.map((service) => ({
    ...service,
    count: window.reduce((sum, point) => sum + (point.byService[service.key] ?? 0), 0),
  }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return rows
    .map((row) => ({ ...row, percent: total > 0 ? Math.round((row.count / total) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
};

export const byService = <T extends AppointmentLike>(rows: T[], service: string): T[] =>
  service === ALL_SERVICES ? rows : rows.filter((row) => row.consultationType === service);

export const activityByService = <T extends ActivityLike>(rows: T[], service: string): T[] =>
  service === ALL_SERVICES ? rows : rows.filter((row) => row.serviceType === service);

export type QueueTab = "all" | "waiting" | "in_progress";

const WAITING = new Set(["confirmed", "rescheduled"]);

export const queueTabOf = (status: string): Exclude<QueueTab, "all"> | null =>
  status === "processing" ? "in_progress" : WAITING.has(status) ? "waiting" : null;

export const byQueueTab = <T extends AppointmentLike>(rows: T[], tab: QueueTab): T[] =>
  tab === "all" ? rows : rows.filter((row) => queueTabOf(row.status) === tab);

export const queueTabCounts = (rows: AppointmentLike[]): Record<QueueTab, number> => ({
  all: rows.length,
  waiting: rows.filter((row) => queueTabOf(row.status) === "waiting").length,
  in_progress: rows.filter((row) => queueTabOf(row.status) === "in_progress").length,
});

export const urgentWaiting = (rows: AppointmentLike[]): number =>
  rows.filter((row) => row.isUrgent && queueTabOf(row.status) !== null).length;

type InventoryAlertLike = { currentStock: number; reorderLevel: number; nearestExpiry: string | null };

export type StockIssue = "out" | "low" | "expiring";

/** What is wrong with a watched item, worst first: none left, below reorder level, or expiring within 30 days. */
export const stockIssueOf = (item: InventoryAlertLike, now: Date = new Date()): StockIssue | null => {
  if (item.currentStock <= 0) return "out";
  if (item.currentStock <= item.reorderLevel) return "low";
  if (item.nearestExpiry) {
    const expiry = new Date(item.nearestExpiry).getTime();
    if (Number.isFinite(expiry) && expiry - now.getTime() < 30 * 24 * 60 * 60 * 1000) return "expiring";
  }
  return null;
};
