import { Text, View } from "react-native";
import { statusLabel } from "@/utils/appointmentDisplay";
import { STATUS_STYLES } from "./residentTheme";

type StatusBadgeProps = {
  status: string;
  compact?: boolean;
};

const StatusBadge = ({ status, compact = false }: StatusBadgeProps) => {
  const key = String(status || "").toLowerCase();
  const tone = STATUS_STYLES[key] ?? STATUS_STYLES.unknown;
  const label = statusLabel(key);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      className={`self-start rounded-full ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}`}
      style={{ backgroundColor: tone.bg }}
    >
      <Text
        className={compact ? "text-[11.5px] font-semibold" : "text-[12.5px] font-semibold"}
        style={{ color: tone.fg }}
      >
        {label}
      </Text>
    </View>
  );
};

export default StatusBadge;
