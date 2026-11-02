import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import useClinicalSave from "../hooks/useClinicalSave";
import { immunizationApi } from "../services/immunizationApi";
import useImmunizationStyles from "./immunizationStyles";

const ReminderPreference = ({
  enabled,
  onReload,
}: {
  enabled: boolean;
  onReload: () => Promise<void>;
}) => {
  const { styles } = useImmunizationStyles();
  const saving = useClinicalSave();
  return (
    <View style={styles.section}>
      <Text style={styles.strong}>
        In-app reminders: {enabled ? "On" : "Off"}
      </Text>
      <Text style={styles.body}>
        Reminders appear in your MaslogCare inbox when the verified schedule is
        active. No SMS or email is sent by this setting.
      </Text>
      <Button
        label={
          enabled ? "Turn off in-app reminders" : "Turn on in-app reminders"
        }
        variant="secondary"
        loading={saving.saving}
        onPress={() =>
          void saving.save(
            () => immunizationApi.preferences(!enabled),
            onReload,
          )
        }
      />
      {saving.error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saving.error} Try changing the preference again.
        </Text>
      ) : null}
    </View>
  );
};
export default ReminderPreference;
