import { View } from "react-native";

import PersonCard from "./PersonCard";
import useRecordModalStyles from "./recordModalStyles";
import { babyMeta, motherMeta } from "./recordModel";
import type { Baby, Mother } from "./types";

type PatientStripProps = {
  baby: Baby;
  mother: Mother;
  /** The two people sit one above the other when each would be too narrow. */
  stacked: boolean;
  onBabyDetails: () => void;
  onMotherDetails: () => void;
  onMotherRecords: () => void;
};

const PatientStrip = ({ baby, mother, stacked, onBabyDetails, onMotherDetails, onMotherRecords }: PatientStripProps) => {
  const { styles } = useRecordModalStyles();
  return (
    <View style={[styles.strip, stacked && styles.stripStacked]}>
      <PersonCard
        tag="BABY"
        name={baby.name}
        chip={baby.isSampleName ? "Sample name" : undefined}
        meta={babyMeta(baby)}
        onDetails={onBabyDetails}
        ruled={!stacked}
        style={stacked ? undefined : styles.personLeft}
      />
      <PersonCard
        tag="MOTHER"
        name={mother.name}
        meta={motherMeta(mother)}
        onDetails={onMotherDetails}
        link={{ label: "View mother's records", onPress: onMotherRecords }}
        ruled={!stacked}
        style={stacked ? styles.personDivided : styles.personRight}
      />
    </View>
  );
};

export default PatientStrip;
