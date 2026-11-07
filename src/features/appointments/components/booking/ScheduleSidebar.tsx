import { ActivityIndicator } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import { SidebarCard, SidebarNote } from "./ClinicHoursCard";
import { ClinicHoursRows } from "./ClinicHoursPanel";

/**
 * The right-hand column of the Details step. BP checking and prenatal show
 * their clinic hours; a queued doctor service explains how its time is set;
 * before a service is chosen it says what will appear here.
 */
export const ScheduleSidebar = ({ booking }: { booking: AppointmentBooking }) => {
  const schedule = booking.regularPicker.schedule;
  const label = booking.selectedService?.label ?? "This service";

  if (booking.regular && schedule) {
    return (
      <SidebarCard title="Clinic hours">
        <ClinicHoursRows schedule={schedule} />
      </SidebarCard>
    );
  }
  if (booking.regular) {
    return (
      <SidebarCard title="Clinic hours">
        <ActivityIndicator color={APPOINTMENT_COLORS.primaryBright} accessibilityLabel="Loading clinic hours" />
      </SidebarCard>
    );
  }
  if (booking.queued) {
    return (
      <SidebarCard title="How scheduling works">
        <SidebarNote text={`${label} is seen by the doctor on medical mission days. You can send your request now, even before a mission is scheduled.`} />
        <SidebarNote text="You get a notification when your date and time are assigned, and the appointment then appears under Appointments." />
      </SidebarCard>
    );
  }
  return (
    <SidebarCard title="Clinic hours">
      <SidebarNote text="Choose a service to see when it is open." />
    </SidebarCard>
  );
};

export default ScheduleSidebar;
