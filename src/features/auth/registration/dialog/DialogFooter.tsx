import { View } from "react-native";

import { useSheetLayoutContext } from "@/components/ui/sheetLayout/SheetLayoutContext";

import FormError from "../components/FormError";
import RegistrationFooter from "../components/RegistrationFooter";
import { REG_COLORS } from "../registrationTheme";
import type { useResidentRegistration } from "../useResidentRegistration";

type Props = {
  form: ReturnType<typeof useResidentRegistration>;
  isSheet: boolean;
  horizontalPadding: number;
  buttonHeight: number;
  onPrimaryPress: () => void;
};

const DialogFooter = ({
  form,
  isSheet,
  horizontalPadding,
  buttonHeight,
  onPrimaryPress,
}: Props) => {
  // Home-indicator padding while the keyboard is closed, none while it is up
  // (that would be dead space between the buttons and the keys).
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
      {form.step.key !== "review" ? <FormError message={form.submitError} /> : null}

      <RegistrationFooter
        onBack={form.stepIndex > 0 ? form.goBack : undefined}
        onNext={onPrimaryPress}
        isFinalStep={form.isLastStep}
        isSubmitting={form.isSubmitting}
        canSubmit={form.canSubmit}
        height={buttonHeight}
      />
    </View>
  );
};

export default DialogFooter;
