import type { ReactNode } from "react";
import { Text, View } from "react-native";

import FieldMessage from "@/components/forms/FieldMessage";
import { useThemeColors } from "@/hooks/useThemeColors";

type PickerFieldShellProps = {
  label: string;
  messageId: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
};

/** Label and message chrome matching `TextField`, around a date or time control. */
const PickerFieldShell = ({ label, messageId, error, helper, required = false, children }: PickerFieldShellProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ width: "100%", gap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: colors.heading }}>
        {label}
        {required ? <Text style={{ color: colors.danger.fg }}> *</Text> : null}
      </Text>
      {children}
      <FieldMessage nativeID={messageId} error={error} helper={helper} />
    </View>
  );
};

export default PickerFieldShell;
