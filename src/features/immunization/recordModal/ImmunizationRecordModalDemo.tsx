import { useState } from "react";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";

import ImmunizationRecordModal from "./ImmunizationRecordModal";
import { MOCK_RECORD } from "./mock";
import useRecordModalStyles from "./recordModalStyles";

/**
 * Opens the modal with test data, to review it in isolation. No route renders this:
 * adding one is a navigation change, and test data must not reach a production screen.
 */
const ImmunizationRecordModalDemo = () => {
  const { styles } = useRecordModalStyles();
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState("None");
  const report = (action: string) => () => setLastAction(action);
  return (
    <View style={styles.panel}>
      <Button label="Open immunization record" onPress={() => setOpen(true)} />
      <Text accessibilityLiveRegion="polite" style={styles.footnote}>
        Last action: {lastAction}
      </Text>
      <ImmunizationRecordModal
        open={open}
        record={MOCK_RECORD}
        onClose={() => setOpen(false)}
        onEdit={report("Edit record")}
        onBabyDetails={report("Baby details")}
        onMotherDetails={report("Mother details")}
        onMotherRecords={report("View mother's records")}
      />
    </View>
  );
};

export default ImmunizationRecordModalDemo;
