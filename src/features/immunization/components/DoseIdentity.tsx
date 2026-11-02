import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import type { Checklist, DoseView } from "../types";
import useImmunizationStyles from "./immunizationStyles";

const DoseIdentity = ({
  checklist,
  dose,
}: {
  checklist: Checklist;
  dose: DoseView;
}) => {
  const { styles } = useImmunizationStyles();
  const { user } = useAuth();
  const vaccine = checklist.schedule.vaccines.find(
    (item) => item.key === dose.vaccineKey,
  );
  return (
    <View style={styles.section}>
      <Text style={styles.strong}>
        {checklist.baby.name} · {vaccine?.name} · {dose.label}
      </Text>
      <Text style={styles.body}>
        Baby ID: {checklist.baby._id}
        {"\n"}Mother: {checklist.mother.name}
        {"\n"}Mother ID: {checklist.mother.masterResidentId}
        {"\n"}Born: {checklist.baby.dateOfBirth.slice(0, 10)}
      </Text>
      <Text style={styles.muted}>
        Recording session: {user?.name || "Signed-in midwife"}. The clinician
        field identifies who gave the vaccine. The server records the signed-in
        user separately.
      </Text>
      {dose.record?.recordedBy ? (
        <Text style={styles.muted}>
          Saved by: {dose.record.recordedBy} · Revision {dose.record.revision}
        </Text>
      ) : null}
    </View>
  );
};
export default DoseIdentity;
