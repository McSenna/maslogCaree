import { Text, View, type DimensionValue } from "react-native";

import DoseChip from "./DoseChip";
import { ageLabelOf, doseSpokenLabel, scheduledDoses } from "./recordModel";
import useScheduleStyles from "./scheduleStyles";
import type { Vaccine } from "./types";
import VaccineName from "./VaccineName";

type ScheduleCardsProps = {
  vaccines: readonly Vaccine[];
  /** One column on phones, a fixed width for two columns on tablets. */
  cardWidth: DimensionValue;
};

const ScheduleCards = ({ vaccines, cardWidth }: ScheduleCardsProps) => {
  const { styles } = useScheduleStyles();
  return (
    <View style={styles.cards}>
      {vaccines.map((vaccine) => (
        <View key={vaccine.id} style={[styles.card, { width: cardWidth }]}>
          <VaccineName name={vaccine.name} />
          {scheduledDoses(vaccine).map((dose) => {
            const age = ageLabelOf(dose.slot);
            return (
              <View key={dose.slot} style={styles.cardRow}>
                <Text style={styles.cardAge}>{age}</Text>
                <DoseChip compact dose={dose} spokenLabel={doseSpokenLabel(vaccine.name, age, dose)} />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default ScheduleCards;
