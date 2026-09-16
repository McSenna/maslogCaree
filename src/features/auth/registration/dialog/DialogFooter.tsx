import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: horizontalPadding,
        paddingTop: 14,
        paddingBottom: isSheet ? Math.max(insets.bottom, 12) + 8 : 22,
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
