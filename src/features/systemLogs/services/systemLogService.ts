import { Platform } from "react-native";
import api from "@/services/api";
import { todayDateKey } from "@/utils/dateFormatter";

import type {
  SystemLogListResponse,
  SystemLogStatsResponse,
  SystemLogsQuery,
} from "../types/systemLog.types";

export * from "../types/systemLog.types";
export * from "../constants/systemLogOptions";
export * from "../utils/systemLogFormat";


export async function fetchSystemLogs(params: SystemLogsQuery = {}): Promise<SystemLogListResponse> {
  const response = await api.get<SystemLogListResponse>("/system-logs", { params });
  return response.data;
}

export async function fetchSystemLogStats(): Promise<SystemLogStatsResponse> {
  const response = await api.get<SystemLogStatsResponse>("/system-logs/stats");
  return response.data;
}

export async function exportSystemLogs(params: SystemLogsQuery = {}): Promise<void> {
  const response = await api.get("/system-logs/export", {
    params,
    responseType: "blob",
  });

  if (Platform.OS !== "web") {
    throw new Error("Export is only available on web.");
  }

  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = todayDateKey();
  link.href = url;
  link.download = `system-logs-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
