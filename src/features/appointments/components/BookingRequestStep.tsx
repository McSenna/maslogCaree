import { ActivityIndicator, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APPOINTMENT_FIELD_ICONS } from "@/config/appointmentServices";
import type { AppointmentBooking } from "../hooks/useAppointmentBooking";
import { BOOKING_NOTE } from "../constants/bookingCopy";
import { APPOINTMENT_COLORS } from "./appointmentTheme";
import AppointmentAlert from "./AppointmentAlert";
import BookingActionButton from "./BookingActionButton";
import ConfirmationCheckbox from "./ConfirmationCheckbox";
import FormSelectField from "./FormSelectField";
import ImmunizationVisitFields from "./ImmunizationVisitFields";
import MissionVisitFields from "./MissionVisitFields";
import ResidentInfoCard from "./ResidentInfoCard";

type BookingRequestStepProps = {
  booking: AppointmentBooking;
};

const BookingRequestStep = ({ booking }: BookingRequestStepProps) => {
  const { errors, submitting, servicesUnavailable } = booking;

  return (
    <>
      <ResidentInfoCard resident={booking.resident} />

      <View style={{ gap: 12 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 18, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
        >
          Appointment Details
        </Text>

        <AppointmentAlert tone="info" message={BOOKING_NOTE} />

        {booking.servicesError ? (
          <AppointmentAlert
            tone="danger"
            align="center"
            message="Unable to load services. Please try again."
            action={{
              label: "Retry",
              accessibilityLabel: "Retry loading services",
              onPress: () => void booking.loadServices(),
            }}
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
          error={errors.serviceType}
          loading={booking.servicesLoading}
          loadingText="Loading services…"
          disabled={servicesUnavailable}
          emptyText="No appointment services are currently available."
          helperText={booking.selectedService?.helper ?? null}
        />

        {booking.weekly ? <ImmunizationVisitFields booking={booking} /> : <MissionVisitFields booking={booking} />}
      </View>

      <ConfirmationCheckbox
        checked={booking.confirmed}
        onToggle={() => {
          booking.toggleConfirmed();
          booking.clearError("confirmed");
        }}
        error={errors.confirmed}
      />

      {booking.submitError ? <AppointmentAlert tone="danger" message={booking.submitError} /> : null}

      <View style={{ gap: 10 }}>
        <BookingActionButton
          variant="primary"
          label={submitting ? "Booking Appointment..." : "Book Appointment"}
          accessibilityLabel="Book Appointment"
          onPress={() => void booking.submit()}
          disabled={submitting || servicesUnavailable}
          busy={submitting}
          opacity={submitting || servicesUnavailable ? 0.55 : booking.isComplete ? 1 : 0.75}
          icon={
            submitting ? (
              <ActivityIndicator size="small" color={APPOINTMENT_COLORS.white} />
            ) : (
              <Feather name="calendar" size={17} color={APPOINTMENT_COLORS.white} />
            )
          }
        />

        <BookingActionButton
          variant="neutral"
          label="Cancel"
          accessibilityLabel="Cancel booking"
          onPress={booking.close}
          disabled={submitting}
          opacity={submitting ? 0.6 : 1}
        />
      </View>
    </>
  );
};

export default BookingRequestStep;
