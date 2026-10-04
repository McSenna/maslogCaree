import { View } from "react-native";

import { useSheetLayoutContext } from "@/components/ui/sheetLayout/SheetLayoutContext";
import FormError from "@/features/auth/registration/components/FormError";
import RegistrationFooter from "@/features/auth/registration/components/RegistrationFooter";
import { REG_COLORS } from "@/features/auth/registration/registrationTheme";

import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";

type Props = {
  form: MasterResidentEditorState;
  isSheet: boolean;
  horizontalPadding: number;
  buttonHeight: number;
};

/** Back and Next, then Save on the last step: the registration footer, relabelled. */
const MasterEditorFooter = ({ form, isSheet, horizontalPadding, buttonHeight }: Props) => {
  // Home-indicator padding while the keyboard is closed, none while it is up.
  const sheet = useSheetLayoutContext();
  const sheetBottom = sheet?.keyboardVisible ? 12 : Math.max(sheet?.bottomInset ?? 0, 12) + 8;

  return (
    <View
      style={{
        paddingHorizontal: horizontalPadding,
        paddingTop: 14,
        paddingBottom: isSheet ? sheetBottom : 22,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: REG_COLORS.border,
        backgroundColor: REG_COLORS.surface,
      }}
    >
      {form.isLastStep ? null : <FormError message={form.submitError} />}
      <RegistrationFooter
        onBack={form.stepIndex > 0 ? form.goBack : undefined}
        onNext={() => (form.isLastStep ? void form.submit() : form.goNext())}
        isFinalStep={form.isLastStep}
        isSubmitting={form.submitting}
        canSubmit
        height={buttonHeight}
        finalLabel={form.isEditing ? "Save Changes" : "Add Record"}
        finalBusyLabel="Saving..."
        finalIcon="check"
      />
    </View>
  );
};

export default MasterEditorFooter;
