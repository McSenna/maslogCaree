import type { Feather } from "@expo/vector-icons";

import StatusPill from "@/components/dashboard/kit/StatusPill";
import type { StatusToneName } from "@/design/adminDashboardTheme";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { Status } from "../../adminAnnouncement.types";
import { STATUS_LABELS } from "../../adminAnnouncementModel";

const LOOK: Record<Status, { tone: StatusToneName; icon: keyof typeof Feather.glyphMap }> = {
  active: { tone: "success", icon: "check-circle" },
  draft: { tone: "warning", icon: "edit-3" },
  expired: { tone: "neutral", icon: "clock" },
};

/** The dashboard's status pill: colour, icon and word, so colour is never the only signal. */
const StatusLabel = ({ status }: { status: Status }) => {
  const palette = useAdminSurfacePalette();
  return <StatusPill palette={palette} tone={LOOK[status].tone} icon={LOOK[status].icon} label={STATUS_LABELS[status]} />;
};

export default StatusLabel;
