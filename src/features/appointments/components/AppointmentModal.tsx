import { View } from "react-native";

import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { showAlert } from "@/utils/notify";

import { useAppointmentBooking } from "../hooks/useAppointmentBooking";
import BookingConfirmedStep from "./BookingConfirmedStep";
import BookingRequestStep from "./BookingRequestStep";
import StepProgress from "./StepProgress";

export type AppointmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onBooked?: () => void;
};

const MAX_WIDTH = 640;

/**
 * Booking, centred from tablet width up and a bottom sheet on phones. The state
 * lives above `ResponsiveDialog`, so crossing the breakpoint swaps the frame and
 * keeps every value and error. `ResponsiveDialog` owns focus, Escape, scroll
 * lock, safe areas and the keyboard.
 */
const AppointmentModal = ({ visible, onClose, onBooked }: AppointmentModalProps) => {
  const booking = useAppointmentBooking(visible, onClose, onBooked);

  // True when closing was stopped: a booking is being sent, or there is input to confirm losing.
  const holdClose = (): boolean => {
    if (booking.submitting) return true;
    if (!booking.hasUnsavedInput) return false;
    showAlert("Discard this booking?", "The details you have entered will be lost.", [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: booking.close },
    ]);
    return true;
  };

  const requestClose = () => {
    if (!holdClose()) booking.close();
  };

  return (
    <ResponsiveDialog
      visible={visible}
      title="Book an Appointment"
      subtitle="Resident Appointment Form"
      icon="calendar"
      maxWidth={MAX_WIDTH}
      lightSurface
      // Submit sits at the end of a long form; the confirmation starts from the top.
      scrollToKey={booking.booked ? 1 : 0}
      onClose={requestClose}
      onDismissRequest={holdClose}
    >
      <View style={{ gap: 16 }}>
        <StepProgress step={booking.step} />
        {booking.booked ? (
          <BookingConfirmedStep appointment={booking.booked} onClose={booking.close} />
        ) : (
          <BookingRequestStep booking={booking} onCancel={requestClose} />
        )}
      </View>
    </ResponsiveDialog>
  );
};

export default AppointmentModal;
