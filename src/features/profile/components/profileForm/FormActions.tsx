import { View } from "react-native";
import Button from "@/components/buttons/Button";
import { SPACING } from "@/theme/spacing";

type FormActionsProps = {
  isSubmitting: boolean;
  canSave?: boolean;
  onDiscard?: () => void;
  onSave: () => void;
};

const FormActions = ({ isSubmitting, canSave = true, onDiscard, onSave }: FormActionsProps) => (
  <View style={{ marginTop: SPACING.sm, flexDirection: "row", gap: SPACING.md }}>
    <Button
      variant="secondary"
      label="Cancel"
      onPress={onDiscard}
      disabled={isSubmitting}
      fullWidth
      style={{ flex: 1 }}
    />
    <Button
      label="Save changes"
      loadingLabel="Saving…"
      accessibilityLabel="Save changes"
      onPress={onSave}
      loading={isSubmitting}
      disabled={!canSave}
      fullWidth
      style={{ flex: 1 }}
    />
  </View>
);

export default FormActions;
