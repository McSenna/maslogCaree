import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import { View } from "react-native";
import Button from "@/components/buttons/Button";
import {
  clearImmunizationSelection,
  getImmunizationSelection,
  getChecklistRequestVersion,
  subscribeImmunizationSelection,
} from "../selection";
import {
  getImmunizationVisit,
  subscribeImmunizationVisit,
} from "../visitSelection";
import ImmunizationScreen from "./ImmunizationScreen";
import useImmunizationStyles from "./immunizationStyles";

const MedicalRecordsTabs = ({ children }: { children: ReactNode }) => {
  const { styles } = useImmunizationStyles();
  const selectedBaby = useSyncExternalStore(
    subscribeImmunizationSelection,
    getImmunizationSelection,
    () => null,
  );
  const appointmentId = useSyncExternalStore(
    subscribeImmunizationVisit,
    getImmunizationVisit,
    () => null,
  );
  const requestedChecklist = useSyncExternalStore(
    subscribeImmunizationSelection,
    getChecklistRequestVersion,
    () => 0,
  );
  const [view, setView] = useState<"checklist" | "legacy">("checklist");
  useSyncOnChange([requestedChecklist], () => {
    if (requestedChecklist) setView("checklist");
  });
  useSyncOnChange([selectedBaby, appointmentId], () => {
    if (selectedBaby || appointmentId) setView("checklist");
  });
  return (
    <View style={styles.page}>
      <View style={[styles.row, styles.content]}>
        <Button
          label="Immunization checklist"
          variant={view === "checklist" ? "primary" : "secondary"}
          onPress={() => setView("checklist")}
        />
        <Button
          label="Legacy medical records"
          variant={view === "legacy" ? "primary" : "secondary"}
          onPress={() => {
            clearImmunizationSelection();
            setView("legacy");
          }}
        />
      </View>
      {view === "checklist" ? <ImmunizationScreen /> : children}
    </View>
  );
};
export default MedicalRecordsTabs;
