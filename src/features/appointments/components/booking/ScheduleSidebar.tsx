import { ActivityIndicator } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import { ClinicHoursRows, SidebarCard, SidebarNote } from "./ClinicHoursCard";

/**
 * The right-hand column of the Details step. BP checking shows its clinic
 * hours; a mission service explains where its dates come from; before a
 * service is chosen it says what will appear here.
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
  if (booking.serviceType) {
    return (
      <SidebarCard title="Mission days">
        <SidebarNote text={`${label} is offered on medical mission days. The dates you can pick are the ones the health team has scheduled.`} />
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
