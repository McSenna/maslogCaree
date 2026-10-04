import StatusPill from "@/components/dashboard/kit/StatusPill";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { LINKAGE_PILLS, SOURCE_LABELS } from "../masterlistLabels";
import type { Linkage, MasterlistSource } from "../types";

/** Whether the record reaches a resident account: colour, icon and word. */
export const LinkagePill = ({ linkage }: { linkage: Linkage }) => {
  const palette = useAdminSurfacePalette();
  const pill = LINKAGE_PILLS[linkage];
  return <StatusPill palette={palette} tone={pill.tone} icon={pill.icon} label={pill.label} />;
};

/** Paper, walk-in and mission records are marked; appointment records are the default and stay plain. */
export const SourcePill = ({ source }: { source: MasterlistSource }) => {
  const palette = useAdminSurfacePalette();
  const icon = source === "appointment" ? "calendar" : "archive";
  return <StatusPill palette={palette} tone={source === "appointment" ? "info" : "neutral"} icon={icon} label={SOURCE_LABELS[source]} />;
};
