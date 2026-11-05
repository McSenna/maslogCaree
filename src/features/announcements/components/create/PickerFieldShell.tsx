import type { ReactNode } from "react";
import { Text, View } from "react-native";

import FieldLabel from "@/components/forms/FieldLabel";
import FieldMessage from "@/components/forms/FieldMessage";
import { useThemeColors } from "@/hooks/useThemeColors";

type PickerFieldShellProps = {
  label: string;
  /** The control's id, so its real label element points at it on web. */
  htmlFor?: string;
  messageId: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
};

/** Label and message chrome matching `TextField`, around a date or time control. */
const PickerFieldShell = ({ label, htmlFor, messageId, error, helper, required = false, children }: PickerFieldShellProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ width: "100%", gap: 6 }}>
      <FieldLabel htmlFor={htmlFor}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.heading }}>
          {label}
          {required ? <Text style={{ color: colors.danger.fg }}> *</Text> : null}
        </Text>
      </FieldLabel>
      {children}
      <FieldMessage nativeID={messageId} error={error} helper={helper} />
    </View>
  );
};

export default PickerFieldShell;
