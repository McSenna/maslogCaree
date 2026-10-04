import StatusPill from "@/components/status/StatusPill";
import { useUsersPalette } from "../usersTheme";
import type { UserRequestSummary } from "../../services/userRequestsService";

export type VerificationStatus = UserRequestSummary["verificationStatus"];

const RequestStatusBadge = ({ status, compact = false }: { status: VerificationStatus; compact?: boolean }) => {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;
  return (
    <StatusPill
      label={tone.label}
      icon={tone.icon}
      compact={compact}
      spokenAs="Verification status"
      tone={{ bg: tone.bg, fg: tone.text, border: tone.border }}
    />
  );
};

export default RequestStatusBadge;
