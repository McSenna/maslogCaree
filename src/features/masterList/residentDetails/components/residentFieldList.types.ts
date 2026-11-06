import type { ThemeColors } from "@/theme/colors";

import type { ResidentField } from "../residentDetails.types";

export type ResidentFieldListProps = {
  fields: ResidentField[];
  colors: ThemeColors;
};

/** Label column width; values wrap beside it, so long purok names never push the layout. */
export const FIELD_LABEL_WIDTH = 124;
