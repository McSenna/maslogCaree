import { useState, useSyncExternalStore } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import Button from "@/components/buttons/Button";
import { useAuth } from "@/contexts/AuthContext";
import useChecklist from "../hooks/useChecklist";
import {
  getImmunizationSelection,
  subscribeImmunizationSelection,
} from "../selection";
import ClinicalSaveBoundary from "./ClinicalSaveBoundary";
import BirthForm from "./BirthForm";
import ChecklistContent from "./ChecklistContent";
import MotherSearch from "./MotherSearch";
import useImmunizationStyles from "./immunizationStyles";

const ImmunizationScreenContent = () => {
  const { styles } = useImmunizationStyles();
  const { user } = useAuth();
  const notificationBaby = useSyncExternalStore(
    subscribeImmunizationSelection,
    getImmunizationSelection,
    () => null,
  );
  const isMidwife = user?.role === "midwife";
  const screen = useChecklist(isMidwife, notificationBaby);
  return (
    <KeyboardAvoidingView
      testID="immunization-screen"
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={screen.babies}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.section}>
            <Text accessibilityRole="header" style={styles.title}>
              Baby immunization checklist
            </Text>
            <Text style={styles.body}>
              {isMidwife
                ? "Choose the mother first, then select her baby by unique ID."
                : "Choose your baby to view their immunization record."}
            </Text>
            {isMidwife ? <MotherSearch onSelect={screen.chooseMother} /> : null}
            {screen.mother ? (
              <>
                <Text style={styles.strong}>
                  Selected mother: {screen.mother.name}
                </Text>
                <Text style={styles.body}>
                  Mother ID: {screen.mother.masterResidentId}
                </Text>
                <BirthForm
                  key={screen.mother.masterResidentId}
                  mother={screen.mother}
                  onSaved={screen.chooseBaby}
                />
              </>
            ) : null}
            {screen.loading ? (
              <View
                accessibilityLabel="Loading immunization records"
                style={styles.section}
              >
                <View style={styles.skeleton} />
                <View style={styles.skeleton} />
              </View>
            ) : null}
            {screen.error ? (
              <View style={styles.section}>
                <Text accessibilityRole="alert" style={styles.error}>
                  {screen.error}
                </Text>
                <Button
                  label="Reload immunization records"
                  variant="secondary"
                  onPress={() => void screen.load()}
                />
              </View>
            ) : null}
            {screen.babies.length ? (
              <Text style={styles.heading}>Select baby</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.divider}>
            <Text style={styles.strong}>
              {item.name}
              {item.temporaryName ? " (temporary name)" : ""}
            </Text>
            <Text style={styles.body}>
              Baby ID: {item._id}
              {"\n"}Born: {item.dateOfBirth.slice(0, 10)}
            </Text>
            <Button
              label={
                screen.babyId === item._id
                  ? "Selected baby"
                  : "Open baby checklist"
              }
              disabled={screen.babyId === item._id}
              variant="secondary"
              onPress={() => screen.chooseBaby(item._id)}
            />
          </View>
        )}
        ListEmptyComponent={
          !screen.loading && !screen.error && (!isMidwife || screen.mother) ? (
            <Text style={styles.body}>
              {isMidwife
                ? "No babies recorded for this mother. Record a birth to start a checklist."
                : "No linked baby records are available. Ask the health center to verify your mother registry link and birth record."}
            </Text>
          ) : null
        }
        ListFooterComponent={
          screen.checklist ? (
            <ChecklistContent
              key={screen.checklist.baby._id}
              checklist={screen.checklist}
              isMidwife={isMidwife}
              onReload={screen.load}
            />
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
};
const ImmunizationScreen = () => {
  const [, setBusy] = useState(false);
  return <ClinicalSaveBoundary onBusyChange={setBusy}><ImmunizationScreenContent /></ClinicalSaveBoundary>;
};
export default ImmunizationScreen;
