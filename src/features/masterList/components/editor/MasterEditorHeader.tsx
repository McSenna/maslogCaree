import type { GestureResponderHandlers } from "react-native";
import { View } from "react-native";

import RegistrationChrome from "@/features/auth/registration/RegistrationChrome";
import ProgressStepper from "@/features/auth/registration/components/ProgressStepper";
import { REG_COLORS } from "@/features/auth/registration/registrationTheme";

import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";
import { MASTER_STEPS } from "../../masterResidentSteps";

type Props = {
  form: MasterResidentEditorState;
  isSheet: boolean;
  horizontalPadding: number;
  onClose: () => void;
  dragHandlers: GestureResponderHandlers;
};

/** The registration dialog's header: brand row, title, and the step tracker. */
const MasterEditorHeader = ({ form, isSheet, horizontalPadding, onClose, dragHandlers }: Props) => (
  <>
    {isSheet ? (
      <View {...dragHandlers} style={{ alignItems: "center", paddingTop: 10, paddingBottom: 6 }}>
        <View
          accessibilityLabel="Drag handle"
          style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: REG_COLORS.borderStrong }}
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
      <RegistrationChrome
        onClose={onClose}
        isSheet={isSheet}
        title={form.isEditing ? "Edit Master List Record" : "Add Master List Record"}
        subtitle="An official barangay record. It is not an app account."
        closeLabel="Close the master list record"
      />
      <ProgressStepper
        steps={MASTER_STEPS}
        currentIndex={form.stepIndex}
        completed={form.completedSteps}
        onStepPress={form.goToStep}
        compact={isSheet}
      />
    </View>
  </>
);

export default MasterEditorHeader;
