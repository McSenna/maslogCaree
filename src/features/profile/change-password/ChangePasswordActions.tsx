import { View } from "react-native";

import Button from "@/components/buttons/Button";
import { SPACING } from "@/theme/spacing";

import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings";

type ChangePasswordActionsProps = {
  /** `stacked`: full width with the main action on top, for phone widths. */
  stacked: boolean;
  /** The native screen keeps Cancel in its header, so it shows only the main action. */
  showCancel: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

/**
 * The submit button stays enabled with empty or invalid fields: pressing it
 * shows what is missing instead of leaving the user to guess why it is grey.
 */
export const ChangePasswordActions = ({ stacked, showCancel, isSubmitting, onSubmit, onCancel }: ChangePasswordActionsProps) => {
  const submit = (
    <Button
      label={S.submit}
      size="lg"
      loading={isSubmitting}
      loadingLabel={S.submitting}
      onPress={onSubmit}
      fullWidth={stacked}
    />
  );
  const cancel = showCancel ? (
    <Button variant="outline" size="lg" label={S.cancel} onPress={onCancel} disabled={isSubmitting} fullWidth={stacked} />
  ) : null;

  return stacked ? (
    <View style={{ gap: SPACING.md }}>
      {submit}
      {cancel}
    </View>
  ) : (
    <View className="flex-row flex-wrap justify-end" style={{ gap: SPACING.md }}>
      {cancel}
      {submit}
    </View>
  );
};

export default ChangePasswordActions;
