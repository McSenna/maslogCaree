import { Badge, type BadgeTone, type FeatherName } from "@/components/data-table";

import type { Status } from "../../adminAnnouncement.types";
import { STATUS_LABELS } from "../../adminAnnouncementModel";

const LOOK: Record<Status, { tone: BadgeTone; icon: FeatherName }> = {
  active: { tone: "success", icon: "check-circle" },
  draft: { tone: "warning", icon: "edit-3" },
  expired: { tone: "neutral", icon: "clock" },
};

/** Announcement status: colour, icon and word, so colour is never the only signal. */
const StatusLabel = ({ status }: { status: Status }) => (
  <Badge tone={LOOK[status].tone} icon={LOOK[status].icon} label={STATUS_LABELS[status]} spokenAs="Status" />
);

export default StatusLabel;
