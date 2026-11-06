import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { useResponsive } from "@/hooks/useResponsive";
import { showAlert } from "@/utils/notify";

import { useAppointmentBooking } from "../hooks/useAppointmentBooking";
import BookingConfirmedStep from "./BookingConfirmedStep";
import { BookingDetailsStep } from "./booking/BookingDetailsStep";
import { BookingFooter } from "./booking/BookingFooter";
import { BookingReviewStep } from "./booking/BookingReviewStep";
import { BookingStepper } from "./booking/BookingStepper";

export type AppointmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onBooked?: () => void;
};

// Wide enough for the form beside the schedule sidebar; one column below desktop.
const DESKTOP_WIDTH = 940;
const SINGLE_COLUMN_WIDTH = 640;

const STAGE_SCROLL_KEY = { details: 0, review: 1, confirmed: 2 } as const;

/**
 * Booking in two steps, Details then Review, with the actions pinned at the
 * bottom. Centred from tablet width up and a bottom sheet on phones. The state
 * lives above `ResponsiveDialog`, so crossing the breakpoint swaps the frame and
 * keeps every value and error. `ResponsiveDialog` owns focus, Escape, scroll
 * lock, safe areas and the keyboard.
 */
const AppointmentModal = ({ visible, onClose, onBooked }: AppointmentModalProps) => {
  const booking = useAppointmentBooking(visible, onClose, onBooked);
  const { isDesktop } = useResponsive();

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
      title="Book an appointment"
      subtitle="Choose a service and appointment time"
      icon="calendar"
      headerVariant="prominent"
      maxWidth={isDesktop ? DESKTOP_WIDTH : SINGLE_COLUMN_WIDTH}
      lightSurface
      subheader={<BookingStepper stage={booking.stage} />}
      footer={booking.stage === "confirmed" ? undefined : <BookingFooter booking={booking} onCancel={requestClose} />}
      // Each step starts from the top: Continue, Back and the confirmation all change the whole body.
      scrollToKey={STAGE_SCROLL_KEY[booking.stage]}
      onClose={requestClose}
      onDismissRequest={holdClose}
    >
      {booking.stage === "details" ? <BookingDetailsStep booking={booking} /> : null}
      {booking.stage === "review" ? <BookingReviewStep booking={booking} /> : null}
      {booking.booked ? <BookingConfirmedStep appointment={booking.booked} onClose={booking.close} /> : null}
    </ResponsiveDialog>
  );
};

export default AppointmentModal;
