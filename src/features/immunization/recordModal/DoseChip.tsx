import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { formatRecordDate } from "./recordModel";
import useScheduleStyles from "./scheduleStyles";
import type { Dose } from "./types";

const ICON_SIZE = 16;

type DoseChipProps = {
  dose: Dose;
  /** The full cell reading, such as "MMR, 9 months: Dose 1, requires review". */
  spokenLabel: string;
  /** Sits beside an age label on a card instead of filling a table cell. */
  compact?: boolean;
};

const DoseChip = ({ dose, spokenLabel, compact = false }: DoseChipProps) => {
  const { colors, styles } = useScheduleStyles();
  const completed = dose.status === "completed";
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={spokenLabel}
      style={[styles.chip, compact && styles.chipCompact, completed ? styles.chipCompleted : styles.chipPending]}
    >
      <View style={styles.chipHead}>
        <Feather
          name={completed ? "check-square" : "alert-circle"}
          size={ICON_SIZE}
          color={completed ? colors.success.fg : colors.muted}
        />
        <Text style={[styles.chipTitle, completed && styles.chipTitleCompleted]}>{dose.label}</Text>
      </View>
      <Text style={[styles.chipSub, completed && styles.chipSubCompleted]}>
        {completed ? formatRecordDate(dose.administeredOn ?? "") : "Requires review"}
      </Text>
    </View>
  );
};

export default DoseChip;
