import { ActivityIndicator, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APPOINTMENT_FIELD_ICONS } from "@/config/appointmentServices";
import type { AppointmentBooking } from "../hooks/useAppointmentBooking";
import { AUTO_SCHEDULE_NOTE } from "../constants/bookingCopy";
import { APPOINTMENT_COLORS, TEXT_LIMIT } from "./appointmentTheme";
import AppointmentAlert from "./AppointmentAlert";
import BookingActionButton from "./BookingActionButton";
import ConfirmationCheckbox from "./ConfirmationCheckbox";
import FormSelectField from "./FormSelectField";
import FormTextArea from "./FormTextArea";
import ResidentInfoCard from "./ResidentInfoCard";

type BookingRequestStepProps = {
  booking: AppointmentBooking;
  onClose: () => void;
};

/** Step 1 — what the resident is asking for. */
export default function BookingRequestStep({ booking, onClose }: BookingRequestStepProps) {
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

        <AppointmentAlert tone="info" message={AUTO_SCHEDULE_NOTE} />

        {booking.servicesError ? (
          <AppointmentAlert
            tone="danger"
            align="center"
            // The specific failure is kept in state for diagnosis; the resident
            // is shown the one thing they can act on.
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
          onChange={(id) => {
            booking.setServiceType(id);
            booking.clearError("serviceType");
          }}
          error={errors.serviceType}
          loading={booking.servicesLoading}
          loadingText="Loading services…"
          disabled={servicesUnavailable}
          emptyText="No appointment services are currently available."
          helperText={booking.selectedService?.helper ?? null}
        />

        <FormTextArea
          label="Reason for Visit / Symptoms"
          required
          placeholder="Describe your symptoms or reason for visit..."
          icon={APPOINTMENT_FIELD_ICONS.reason}
          value={booking.reason}
          onChangeText={(next) => {
            booking.setReason(next);
            if (next.trim()) booking.clearError("reason");
          }}
          error={errors.reason}
          maxLength={TEXT_LIMIT}
        />

        <FormTextArea
          label="Additional Notes"
          optional
          placeholder="Add any additional information (optional)..."
          icon={APPOINTMENT_FIELD_ICONS.notes}
          value={booking.notes}
          onChangeText={booking.setNotes}
          maxLength={TEXT_LIMIT}
          minHeight={80}
        />
      </View>

      <ConfirmationCheckbox
        checked={booking.confirmed}
        onToggle={() => {
          booking.toggleConfirmed();
          booking.clearError("confirmed");
        }}
        error={errors.confirmed}
      />

      {booking.submitError ? (
        <AppointmentAlert tone="danger" message={booking.submitError} />
      ) : null}

      <View style={{ gap: 10 }}>
        <BookingActionButton
          variant="primary"
          label={submitting ? "Booking Appointment..." : "Book Appointment"}
          accessibilityLabel="Book Appointment"
          onPress={() => void booking.submit()}
          // Disabled only when submitting or when there is nothing to book.
          // With fields still missing it stays pressable but dimmed, so pressing
          // it explains what is missing instead of leaving a dead button and no
          // reason.
          disabled={submitting || servicesUnavailable}
          busy={submitting}
          opacity={submitting || servicesUnavailable ? 0.55 : booking.isComplete ? 1 : 0.75}
          icon={
            submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={17} color="#FFFFFF" />
            )
          }
        />

        <BookingActionButton
          variant="neutral"
          label="Cancel"
          accessibilityLabel="Cancel"
          onPress={onClose}
          disabled={submitting}
          opacity={submitting ? 0.6 : 1}
        />
      </View>
    </>
  );
}
