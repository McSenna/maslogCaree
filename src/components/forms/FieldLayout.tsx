import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import FieldLabel from "./FieldLabel";

type FieldLayoutProps = {
  label: string;
  required: boolean;
  inputId?: string;
  /** `start` puts the label in a fixed column beside the control, for wide forms. */
  position: "top" | "start";
  labelWidth: number;
  /** The control's height, so a side label centres on it rather than on the whole field. */
  controlHeight: number;
  control: ReactNode;
  message: ReactNode;
  below?: ReactNode;
};

/** Where a form field's label, control, message and extras sit relative to each other. */
const FieldLayout = ({ label, required, inputId, position, labelWidth, controlHeight, control, message, below }: FieldLayoutProps) => {
  const colors = useThemeColors();
  const labelNode = (
    <FieldLabel htmlFor={inputId}>
      <Text style={{ fontSize: 15, lineHeight: 20, fontWeight: "600", color: colors.heading }}>
        {label}
        {required ? <Text style={{ color: colors.danger.fg }}> *</Text> : null}
      </Text>
    </FieldLabel>
  );

  if (position === "top") {
    return (
      <View className="w-full gap-1.5">
        {labelNode}
        {control}
        {message}
        {below}
      </View>
    );
  }

  return (
    <View className="w-full flex-row items-start gap-4">
      <View className="justify-center" style={{ width: labelWidth, minHeight: controlHeight }}>
        {labelNode}
      </View>
      <View className="min-w-0 flex-1 gap-1.5">
        {control}
        {message}
        {below}
      </View>
    </View>
  );
};

export default FieldLayout;
