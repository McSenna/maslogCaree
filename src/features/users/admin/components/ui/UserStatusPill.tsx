import { Badge, type BadgeTone, type FeatherName } from "@/components/data-table";

import type { UserStatus } from "../../userAdmin.types";
import { STATUS_LABELS } from "../../userAdminModel";

type Look = { tone: BadgeTone; icon: FeatherName };

const LOOK: Record<UserStatus, Look> = {
  active: { tone: "success", icon: "check-circle" },
  approved: { tone: "info", icon: "check" },
  requested: { tone: "warning", icon: "clock" },
  rejected: { tone: "danger", icon: "x-circle" },
  deactivated: { tone: "danger", icon: "slash" },
};

/** Account status: colour, icon and word, so colour is never the only signal. */
const UserStatusPill = ({ status }: { status: UserStatus }) => {
  const look = LOOK[status];
  return <Badge tone={look.tone} icon={look.icon} label={STATUS_LABELS[status]} spokenAs="Account status" />;
};

export default UserStatusPill;
