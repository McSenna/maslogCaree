import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { RADII } from "@/theme/radius";

export type StatusPillTone = { bg: string; fg: string; border?: string };

type StatusPillProps = {
  label: string;
  tone: StatusPillTone;
  icon?: keyof typeof Feather.glyphMap;
  compact?: boolean;
  /** Spoken prefix, e.g. "Verification status". */
  spokenAs?: string;
};

/**
 * The one status badge shape: icon plus label on the status tint, so a state
 * never rests on colour alone and every list (appointments, accounts, stock,
 * logs) shows status the same way.
 */
const StatusPill = ({ label, tone, icon, compact = true, spokenAs = "Status" }: StatusPillProps) => (
  <View
    accessible
    accessibilityRole="text"
    accessibilityLabel={`${spokenAs}: ${label}`}
    style={{
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: compact ? 8 : 12,
      paddingVertical: compact ? 4 : 6,
      borderRadius: RADII.pill,
      borderWidth: 1,
      borderColor: tone.border ?? tone.bg,
      backgroundColor: tone.bg,
    }}
  >
    {icon ? <Feather name={icon} size={compact ? 12 : 14} color={tone.fg} /> : null}
    <Text numberOfLines={1} style={{ color: tone.fg, fontSize: compact ? 12 : 13, fontWeight: "600" }}>
      {label}
    </Text>
  </View>
);

export default StatusPill;
