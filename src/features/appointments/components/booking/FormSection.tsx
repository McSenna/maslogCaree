import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { APPOINTMENT_COLORS } from "../appointmentTheme";

type Props = {
  title: string;
  /** Draws the rule that separates this section from the one above. */
  divided?: boolean;
  children: ReactNode;
};

/** One titled part of the Details step: Service, Date & Time, Visit Information. */
export const FormSection = ({ title, divided = false, children }: Props) => (
  <View className={divided ? "gap-3 border-t pt-5" : "gap-3"} style={divided ? { borderColor: APPOINTMENT_COLORS.divider } : null}>
    <Text accessibilityRole="header" style={[TYPE.title, { color: APPOINTMENT_COLORS.primary }]}>
      {title}
    </Text>
    {children}
  </View>
);

export default FormSection;
