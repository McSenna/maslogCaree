import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useSheetLayoutContext } from "@/components/ui/sheetLayout/SheetLayoutContext";
import {
  REG_COLORS,
  REG_RADIUS,
} from "@/features/auth/registration/registrationTheme";

import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";

type Props = {
  form: MasterResidentEditorState;
  isSheet: boolean;
  horizontalPadding: number;
  buttonHeight: number;
  onCancel: () => void;
};

const MasterEditorFooter = ({
  form,
  isSheet,
  horizontalPadding,
  buttonHeight,
  onCancel,
}: Props) => {
  const sheet = useSheetLayoutContext();
  const sheetBottom = sheet?.keyboardVisible
    ? 12
    : Math.max(sheet?.bottomInset ?? 0, 12) + 8;
  return (
    <View
      style={{
        paddingHorizontal: horizontalPadding,
        paddingTop: 14,
        paddingBottom: isSheet ? sheetBottom : 22,
        borderTopWidth: 1,
        borderTopColor: REG_COLORS.border,
        backgroundColor: REG_COLORS.surface,
        flexDirection: "row",
        gap: 12,
      }}
    >
      <Pressable
        onPress={onCancel}
        disabled={form.submitting}
        accessibilityRole="button"
        accessibilityState={{ disabled: form.submitting }}
        style={{
          minHeight: buttonHeight,
          paddingHorizontal: 20,
          justifyContent: "center",
          borderRadius: REG_RADIUS.control,
          borderWidth: 1,
          borderColor: REG_COLORS.border,
          opacity: form.submitting ? 0.5 : 1,
        }}
      >
        <Text
          style={{ fontSize: 15, fontWeight: "600", color: REG_COLORS.muted }}
        >
          Cancel
        </Text>
      </Pressable>
      <Pressable
        onPress={() => void form.submit()}
        disabled={form.submitting}
        accessibilityRole="button"
        accessibilityLabel={
          form.submitting ? "Saving resident" : "Save Resident"
        }
        accessibilityState={{
          disabled: form.submitting,
          busy: form.submitting,
        }}
        style={{
          flex: 1,
          minHeight: buttonHeight,
          flexDirection: "row",
          gap: 9,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: REG_RADIUS.control,
          backgroundColor: REG_COLORS.primary,
          opacity: form.submitting ? 0.65 : 1,
        }}
      >
        {form.submitting ? (
          <ActivityIndicator size="small" color={REG_COLORS.surface} />
        ) : null}
        <Text
          style={{ fontSize: 15, fontWeight: "700", color: REG_COLORS.surface }}
        >
          {form.submitting ? "Saving…" : "Save Resident"}
        </Text>
      </Pressable>
    </View>
  );
};

export default MasterEditorFooter;
