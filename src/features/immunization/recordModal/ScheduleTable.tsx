import { Platform, Text, View } from "react-native";

import DoseChip from "./DoseChip";
import { AGE_SLOTS, doseAt, doseSpokenLabel } from "./recordModel";
import useScheduleStyles from "./scheduleStyles";
import type { Vaccine } from "./types";
import VaccineName from "./VaccineName";

type TableRole = "table" | "row" | "columnheader" | "rowheader" | "cell";

const roleOf = (role: TableRole) => (Platform.OS === "web" ? role : undefined);

/** Ages across and vaccines down, so each dose is read with both of its headers. */
const ScheduleTable = ({ vaccines }: { vaccines: readonly Vaccine[] }) => {
  const { styles } = useScheduleStyles();
  return (
    <View role={roleOf("table")} accessibilityLabel="Vaccination schedule by age" style={styles.table}>
      <View role={roleOf("row")} style={[styles.row, styles.rowHeader]}>
        <View role={roleOf("columnheader")} style={styles.vaccineCell}>
          <Text style={styles.vaccineHeaderText}>Vaccine</Text>
        </View>
        {AGE_SLOTS.map((slot) => (
          <View key={slot.key} role={roleOf("columnheader")} style={styles.slotCell}>
            <Text style={styles.headerText}>{slot.label}</Text>
          </View>
        ))}
      </View>
      {vaccines.map((vaccine, index) => (
        <View
          key={vaccine.id}
          role={roleOf("row")}
          style={[styles.row, index === vaccines.length - 1 && styles.rowLast]}
        >
          <View role={roleOf("rowheader")} style={styles.vaccineCell}>
            <VaccineName name={vaccine.name} />
          </View>
          {AGE_SLOTS.map((slot) => {
            const dose = doseAt(vaccine, slot.key);
            const spokenLabel = doseSpokenLabel(vaccine.name, slot.label, dose);
            return (
              <View key={slot.key} role={roleOf("cell")} style={styles.slotCell}>
                {dose ? (
                  <DoseChip dose={dose} spokenLabel={spokenLabel} />
                ) : (
                  <View accessible accessibilityRole="text" accessibilityLabel={spokenLabel}>
                    <Text style={styles.notScheduled}>–</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default ScheduleTable;
