/**
 * Column widths shared by the heading band and every data row, sized like the
 * Masterlist tab's columns: fixed widths never shrink, the text columns take
 * what is left. The table
 * lives beside the app sidebar, so modes follow the measured content width
 * rather than the window: about 1096px at a 1440 window, 968px at 1280, 712px at 1024.
 *
 * - full: every column.
 * - laptop: Access moves under the email.
 * - tablet: Access and Location move into the user cell.
 */
export type TableMode = "full" | "laptop" | "tablet";

export const COLUMN = {
  check: "w-5 shrink-0",
  user: "min-w-0 flex-[1.5]",
  role: "w-[100px] shrink-0",
  access: "w-[120px] shrink-0",
  location: "min-w-0 flex-[1.2]",
  status: "w-[130px] shrink-0",
  lastLogin: "w-[120px] shrink-0",
  actions: "w-11 shrink-0 items-end",
  requested: "w-[120px] shrink-0",
  submitted: "w-[120px] shrink-0",
  decide: "w-[200px] shrink-0 items-end",
  review: "w-[110px] shrink-0 items-end",
} as const;

// Below this the screen uses the phone list, which also covers portrait tablets.
export const TABLE_MIN_WIDTH = 700;

export const tableModeFor = (width: number): TableMode => {
  if (width >= 1040) return "full";
  if (width >= 900) return "laptop";
  return "tablet";
};

/** The search, filters and tabs share one toolbar row only when all fit. */
export const TOOLBAR_ONE_ROW_WIDTH = 1180;
