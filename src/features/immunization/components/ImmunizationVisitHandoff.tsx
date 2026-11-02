import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { requestImmunizationChecklist } from "../selection";
import { setImmunizationVisit } from "../visitSelection";
import useImmunizationStyles from "./immunizationStyles";

const ImmunizationVisitHandoff = ({
  appointmentId,
  onClose,
}: {
  appointmentId: string;
  onClose: () => void;
}) => {
  const { styles } = useImmunizationStyles();
  const router = useGuardedNavigation();
  const open = () => {
    setImmunizationVisit(appointmentId);
    requestImmunizationChecklist();
    onClose();
    router.push("/midwife/medical-records");
  };
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Record immunization in the medical record form
      </Text>
      <Text style={styles.body}>
        Choose the mother and the correct baby by unique ID. Record each
        administered dose or follow-up in the same form, then complete this linked visit. A
        baby&apos;s identity is never matched automatically from a name or birth
        date.
      </Text>
      <Button label="Open immunization medical record" onPress={open} />
    </View>
  );
};
export default ImmunizationVisitHandoff;
