import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { APPOINTMENT_FIELD_ICONS } from "@/config/appointmentServices";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import AppointmentAlert from "../AppointmentAlert";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import FormSelectField from "../FormSelectField";
import { ClinicHoursRows } from "./ClinicHoursCard";
import { FormSection } from "./FormSection";

const WEB = webStyle({ cursor: "pointer" });

/** "View clinic hours" opens the hours right under the service, for screens without the sidebar. */
const HoursDisclosure = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <Pressable
      {...handlers}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      aria-expanded={open}
      className="min-h-11 flex-row items-center gap-2 rounded-lg"
      style={[focused ? focusRing(APPOINTMENT_COLORS.primaryBright) : null, WEB]}
    >
      <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={APPOINTMENT_COLORS.primaryBright} />
      <Text style={[TYPE.bodyStrong, { color: APPOINTMENT_COLORS.primaryBright, textDecorationLine: hovered ? "underline" : "none" }]}>
        {open ? "Hide clinic hours" : "View clinic hours"}
      </Text>
    </Pressable>
  );
};

/** Section 1 of the Details step: which service, and for BP checking how its schedule works. */
export const ServiceSection = ({ booking }: { booking: AppointmentBooking }) => {
  const [hoursOpen, setHoursOpen] = useState(false);
  const schedule = booking.regular ? booking.regularPicker.schedule : null;

  return (
    <FormSection title="Service">
      {booking.servicesError ? (
        <AppointmentAlert
          tone="danger"
          align="center"
          message="Unable to load services. Please try again."
          action={{ label: "Retry", accessibilityLabel: "Retry loading services", onPress: () => void booking.loadServices() }}
        />
      ) : null}

      <FormSelectField
        label="Service Type"
        required
        sheetTitle="Select service type"
        placeholder="Select service type"
        icon={APPOINTMENT_FIELD_ICONS.service}
        options={booking.serviceOptions}
        value={booking.serviceType}
        onChange={booking.chooseService}
        error={booking.errors.serviceType}
        loading={booking.servicesLoading}
        loadingText="Loading services…"
        disabled={booking.servicesUnavailable}
        emptyText="No appointment services are currently available."
        helperText={booking.selectedService?.helper ?? null}
      />

      {schedule ? (
        <View className="flex-row flex-wrap items-center gap-x-3">
          <HoursDisclosure open={hoursOpen} onToggle={() => setHoursOpen((open) => !open)} />
          <View className="h-4 w-px" style={{ backgroundColor: APPOINTMENT_COLORS.borderStrong }} />
          <Text style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>{`${schedule.intervalMinutes}-minute appointments`}</Text>
        </View>
      ) : null}

      {schedule && hoursOpen ? (
        <View className="rounded-xl px-4 pb-4" style={{ backgroundColor: APPOINTMENT_COLORS.neutralBg }}>
          <ClinicHoursRows schedule={schedule} />
        </View>
      ) : null}
    </FormSection>
  );
};

export default ServiceSection;
