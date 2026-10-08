import { Badge } from "@/components/data-table";

import type { UserRequestSummary } from "../../services/userRequestsService";
import { useUsersPalette } from "../usersTheme";

export type VerificationStatus = UserRequestSummary["verificationStatus"];

const RequestStatusBadge = ({ status, compact = false }: { status: VerificationStatus; compact?: boolean }) => {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;
  return (
    <Badge
      tone={{ bg: tone.bg, fg: tone.text }}
      icon={tone.icon}
      label={tone.label}
      spokenAs="Verification status"
      size={compact ? "sm" : "md"}
    />
  );
};

export default RequestStatusBadge;
