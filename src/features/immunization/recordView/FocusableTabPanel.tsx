import type { ReactNode } from "react";

import FocusableRegion from "@/components/ui/FocusableRegion";

import { panelPropsOf } from "./useVaccinationTabs";

/** Vaccination Details as a tab panel a keyboard can reach and scroll. */
const FocusableTabPanel = ({ baseId, children }: { baseId: string; children: ReactNode }) => (
  <FocusableRegion {...panelPropsOf(baseId, "details")}>{children}</FocusableRegion>
);

export default FocusableTabPanel;
