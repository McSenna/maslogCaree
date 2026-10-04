import StatusPill from "@/components/status/StatusPill";
import type { SystemLogStatus } from "@/features/systemLogs/services/systemLogService";
import { useSystemLogsPalette } from "./systemLogsTheme";

const StatusBadge = ({ status }: { status: SystemLogStatus }) => {
  const palette = useSystemLogsPalette();
  const tone = palette.status[status] ?? palette.status.Success;
  return (
    <StatusPill
      label={tone.label}
      icon={status === "Failed" ? "x-circle" : "check-circle"}
      tone={{ bg: tone.bg, fg: tone.text }}
    />
  );
};

export default StatusBadge;
