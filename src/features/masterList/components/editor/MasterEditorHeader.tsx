import type { GestureResponderHandlers } from "react-native";
import { View } from "react-native";

import RegistrationChrome from "@/features/auth/registration/RegistrationChrome";
import { REG_COLORS } from "@/features/auth/registration/registrationTheme";

import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";

type Props = {
  form: MasterResidentEditorState;
  isSheet: boolean;
  horizontalPadding: number;
  onClose: () => void;
  dragHandlers: GestureResponderHandlers;
};

/** Persistent title and dismissal controls for the resident editor. */
const MasterEditorHeader = ({
  form,
  isSheet,
  horizontalPadding,
  onClose,
  dragHandlers,
}: Props) => (
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
      <RegistrationChrome
        onClose={onClose}
        isSheet={isSheet}
        title={form.isEditing ? "Edit Resident" : "Add Resident"}
        subtitle="Review all details before saving. Required fields are marked with *."
        closeLabel="Close the master list record"
      />
    </View>
  </>
);

export default MasterEditorHeader;
