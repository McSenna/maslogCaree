import type { Feather } from "@expo/vector-icons";

import StatusPill from "@/components/dashboard/kit/StatusPill";
import type { StatusToneName } from "@/design/adminDashboardTheme";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { RequestStatus, UserStatus } from "../../userAdmin.types";
import { STATUS_LABELS } from "../../userAdminModel";

type Look = { tone: StatusToneName; icon: keyof typeof Feather.glyphMap; label: string };

const LOOK: Record<UserStatus | RequestStatus, Look> = {
  active: { tone: "success", icon: "check-circle", label: STATUS_LABELS.active },
  approved: { tone: "info", icon: "check", label: STATUS_LABELS.approved },
  deactivated: { tone: "neutral", icon: "slash", label: STATUS_LABELS.deactivated },
  pending: { tone: "warning", icon: "clock", label: "Pending" },
  rejected: { tone: "danger", icon: "x-circle", label: "Rejected" },
};

/** The dashboard's status pill: colour, icon and word, so colour is never the only signal. */
const UserStatusPill = ({ status }: { status: UserStatus | RequestStatus }) => {
  const palette = useAdminSurfacePalette();
  const look = LOOK[status];
  return <StatusPill palette={palette} tone={look.tone} icon={look.icon} label={look.label} />;
};

export default UserStatusPill;
