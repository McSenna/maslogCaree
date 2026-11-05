import { Text, View } from "react-native";
import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import Button from "@/components/buttons/Button";
import useChecklist from "../hooks/useChecklist";
import { useClinicalTransition } from "../hooks/useClinicalDraft";
import type { Mother } from "../types";
import BirthForm from "./BirthForm";
import ChecklistContent from "./ChecklistContent";
import useImmunizationStyles from "./immunizationStyles";

const ImmunizationRecordFields = ({
  mother,
  onContentChange,
  busy,
}: {
  mother: Mother;
  onContentChange: () => void;
  busy?: boolean;
}) => {
  const { styles } = useImmunizationStyles();
  const screen = useChecklist(true, null, mother);
  const transition = useClinicalTransition();
  return (
    <View testID="immunization-record-fields" style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        Baby immunization record
      </Text>
      <Text style={styles.body}>
        Select the correct baby. Each dose is reviewed and saved here in this
        medical record form.
      </Text>
      {screen.loading ? (
        <View
          accessibilityLabel="Loading baby records"
          style={styles.skeleton}
        />
      ) : null}
      {screen.error ? (
        <View style={styles.section}>
          <Text accessibilityRole="alert" style={styles.error}>
            {screen.error}
          </Text>
          <Button
            label="Reload baby records"
            variant="secondary"
            onPress={() => void screen.load()}
          />
        </View>
      ) : null}
      {!screen.loading && !screen.error && !screen.babies.length ? (
        <Text style={styles.body}>
          No babies recorded for this mother. Record a birth to begin.
        </Text>
      ) : null}
      {screen.loading || screen.error ? null : !screen.checklist ? (
        <>
          {screen.babies.map((baby) => (
            <View key={baby._id} style={styles.divider}>
              <Text style={styles.strong}>{baby.name}</Text>
              <Text style={styles.body}>
                Baby ID: {baby._id}
                {"\n"}Born: {formatCalendarDay(baby.dateOfBirth)}
              </Text>
              <Button
                label="Select baby"
                disabled={busy}
                variant="secondary"
                onPress={() => transition(() => {
                  screen.chooseBaby(baby._id);
                  onContentChange();
                })}
              />
            </View>
          ))}
          <BirthForm mother={mother} onSaved={screen.chooseBaby} />
        </>
      ) : (
        <>
          <Button
            label="Choose another baby"
            disabled={busy}
            variant="secondary"
            onPress={() => transition(() => {
              screen.chooseBaby("");
              onContentChange();
            })}
          />
          <ChecklistContent
            key={screen.checklist.baby._id}
            checklist={screen.checklist}
            isMidwife
            onReload={screen.load}
            busy={busy}
          />
        </>
      )}
    </View>
  );
};
export default ImmunizationRecordFields;
