import type { ReactNode } from "react";
import { View } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import { ScheduleSidebar } from "./ScheduleSidebar";

/** The step's content beside the schedule sidebar on desktop; just the content on smaller screens. */
export const WithScheduleSidebar = ({ booking, children }: { booking: AppointmentBooking; children: ReactNode }) => {
  const { isDesktop } = useResponsive();
  if (!isDesktop) return <>{children}</>;
  return (
    <View className="flex-row gap-5">
      {children}
      <View className="w-px" style={{ backgroundColor: APPOINTMENT_COLORS.divider }} />
      <View className="w-72">
        <ScheduleSidebar booking={booking} />
      </View>
    </View>
  );
};

export default WithScheduleSidebar;
