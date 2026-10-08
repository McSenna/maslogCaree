import { Badge, type BadgeTone, type FeatherName } from "@/components/data-table";

import type { RequestStatus, UserStatus } from "../../userAdmin.types";
import { STATUS_LABELS } from "../../userAdminModel";

type Look = { tone: BadgeTone; icon: FeatherName; label: string };

const LOOK: Record<UserStatus | RequestStatus, Look> = {
  active: { tone: "success", icon: "check-circle", label: STATUS_LABELS.active },
  approved: { tone: "info", icon: "check", label: STATUS_LABELS.approved },
  deactivated: { tone: "danger", icon: "x-circle", label: STATUS_LABELS.deactivated },
  pending: { tone: "warning", icon: "clock", label: "Pending" },
  rejected: { tone: "danger", icon: "x-circle", label: "Rejected" },
};

/** Account status: colour, icon and word, so colour is never the only signal. */
const UserStatusPill = ({ status }: { status: UserStatus | RequestStatus }) => {
  const look = LOOK[status];
  return <Badge tone={look.tone} icon={look.icon} label={look.label} spokenAs="Account status" />;
};

export default UserStatusPill;
