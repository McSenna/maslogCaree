export type SystemLogRole = "admin" | "doctor" | "midwife" | "bhw" | "resident" | "unknown";
export type SystemLogPlatform = "Web" | "Android" | "iOS";
export type SystemLogSeverity = "info" | "success" | "warning" | "error";
export type SystemLogStatus = "Success" | "Failed";

export interface SystemLog {
  _id: string;
  action: string;
  role: SystemLogRole;
  ipAddress: string;
  platform: SystemLogPlatform | string;
  clientPlatform?: string;
  createdAt: string;
  description?: string;
  resource?: string;
  resourceId?: string;
  success: boolean;
  status: SystemLogStatus;
  severity: SystemLogSeverity;
  module: string;
  logType: string;
  device: string;
  browser: string;
  userName: string;
  userEmail: string;
  metadata?: Record<string, any>;
}

export interface SystemLogsQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  action?: string;
  platform?: string;
  severity?: string;
  logType?: string;
  fromDate?: string;
  toDate?: string;
  sort?: "asc" | "desc";
}

export interface SystemLogListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  logs: SystemLog[];
}

export interface SystemLogStatMetric {
  value: number;
  change: number;
  direction: "up" | "down";
  comparisonLabel: string;
}

export interface SystemLogStatsResponse {
  success: boolean;
  stats: {
    totalLogs: SystemLogStatMetric;
    errorsToday: SystemLogStatMetric;
    warnings: SystemLogStatMetric;
    successfulActions: SystemLogStatMetric;
  };
}
