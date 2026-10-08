import { Badge } from "@/components/data-table";

import { LINKAGE_PILLS, SOURCE_LABELS } from "../masterlistLabels";
import type { Linkage, MasterlistSource } from "../types";

/** Whether the record reaches a resident account: colour, icon and word. */
export const LinkagePill = ({ linkage }: { linkage: Linkage }) => {
  const pill = LINKAGE_PILLS[linkage];
  return <Badge tone={pill.tone} icon={pill.icon} label={pill.label} spokenAs="Account link" />;
};

/** Paper, walk-in and mission records are marked; appointment records are the default and stay plain. */
export const SourcePill = ({ source }: { source: MasterlistSource }) => (
  <Badge
    tone={source === "appointment" ? "info" : "neutral"}
    icon={source === "appointment" ? "calendar" : "archive"}
    label={SOURCE_LABELS[source]}
    spokenAs="Source"
  />
);
