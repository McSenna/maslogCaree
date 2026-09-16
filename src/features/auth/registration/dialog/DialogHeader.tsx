import type { GestureResponderHandlers } from "react-native";
import { View } from "react-native";

import RegistrationChrome from "../RegistrationChrome";
import ProgressStepper from "../components/ProgressStepper";
import { REGISTRATION_STEPS } from "../registrationOptions";
import { REG_COLORS } from "../registrationTheme";
import type { useResidentRegistration } from "../useResidentRegistration";

type Props = {
  form: ReturnType<typeof useResidentRegistration>;
  isSheet: boolean;
  horizontalPadding: number;
  onClose: () => void;
  dragHandlers: GestureResponderHandlers;
};

const DialogHeader = ({
  form,
  isSheet,
  horizontalPadding,
  onClose,
  dragHandlers,
}: Props) => {
  return (
    <>
      {isSheet ? (
        <View
          {...dragHandlers}
          style={{ alignItems: "center", paddingTop: 10, paddingBottom: 6 }}
        >
          <View
            accessibilityLabel="Drag handle"
            style={{
              width: 44,
              height: 4.5,
              borderRadius: 3,
              backgroundColor: REG_COLORS.borderStrong,
            }}
          />
        </View>
      ) : null}

      <View
      style={{
        paddingHorizontal: horizontalPadding,
        paddingTop: isSheet ? 8 : 26,
        paddingBottom: 16,
        gap: 18,
        borderBottomWidth: 1,
        borderBottomColor: REG_COLORS.border,
      }}
    >
      <RegistrationChrome onClose={onClose} isSheet={isSheet} />

      {!form.isSucceeded ? (
        <ProgressStepper
          currentIndex={form.stepIndex}
          completed={form.completedSteps}
          onStepPress={(index) => form.goToStep(REGISTRATION_STEPS[index].key)}
          compact={isSheet}
        />
      ) : null}
      </View>
    </>
  );
};

export default DialogHeader;
