import { Text, View } from "react-native";
import { statusLabel } from "@/utils/appointmentDisplay";
import { STATUS_STYLES } from "./residentTheme";

type StatusBadgeProps = {
  /** The raw status from the database, not a display string. */
  status: string;
  /** Tighter padding for the table rows; the default suits cards. */
  compact?: boolean;
};

/**
 * The pill shown against an appointment.
 *
 * Takes the stored status verbatim and resolves both its wording and its colour
 * here, so the badge can never disagree with the record — and an unrecognised
 * status degrades to a neutral pill instead of being mislabelled.
 */
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
