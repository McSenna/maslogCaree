import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";

const FRAME = {
  borderRadius: APPOINTMENT_METRICS.radiusCard,
  borderColor: APPOINTMENT_COLORS.border,
  backgroundColor: APPOINTMENT_COLORS.white,
};

/** The white card the clinic hours sit in ("Soft schedule"), sized to its content. */
export const HoursFrame = ({ children }: { children: ReactNode }) => (
  <View className="gap-4 border p-4" style={FRAME}>
    {children}
  </View>
);

type CardProps = { title: string; children: ReactNode };

/** The side column's card on desktop: a navy headline over its content. */
export const SidebarCard = ({ title, children }: CardProps) => (
  <HoursFrame>
    <Text accessibilityRole="header" style={[TYPE.headline, { fontWeight: "800", color: APPOINTMENT_COLORS.primary }]}>
      {title}
    </Text>
    {children}
  </HoursFrame>
);

export const SidebarNote = ({ text }: { text: string }) => (
  <Text style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>{text}</Text>
);
