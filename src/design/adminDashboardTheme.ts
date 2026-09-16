import type { StoredTheme } from "@/utils/storage";

import { dark } from "./adminDashboard/darkPalette";
import { light } from "./adminDashboard/lightPalette";
import type { AdminDashboardPalette } from "./adminDashboard/paletteTypes";

export type {
  AdminDashboardPalette,
  MetricTone,
  ToneStyle,
  TrendDirection,
  TrendTone,
} from "./adminDashboard/paletteTypes";
export * from "./adminDashboard/dashboardConstants";

export const getAdminDashboardPalette = (theme: StoredTheme): AdminDashboardPalette => {
  return theme === "dark" ? dark : light;
};
