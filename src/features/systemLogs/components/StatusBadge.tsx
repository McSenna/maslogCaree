import { Badge } from "@/components/data-table";
import type { SystemLogStatus } from "@/features/systemLogs/services/systemLogService";

import { useSystemLogsPalette } from "./systemLogsTheme";

const StatusBadge = ({ status }: { status: SystemLogStatus }) => {
  const palette = useSystemLogsPalette();
  const tone = palette.status[status] ?? palette.status.Success;
  return (
    <Badge
      tone={{ bg: tone.bg, fg: tone.text }}
      icon={status === "Failed" ? "x-circle" : "check-circle"}
      label={tone.label}
      spokenAs="Status"
    />
  );
};

export default StatusBadge;
