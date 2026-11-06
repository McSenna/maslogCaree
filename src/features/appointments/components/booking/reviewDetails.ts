import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { formatClock, formatDateKey, slotEndTime } from "../../regularSchedule/scheduleFormat";
import { formatScheduleDate, formatSlotTime } from "../reschedule/rescheduleFormat";

export type ReviewRow = { label: string; value: string };

const NOT_SET = "Not set";

/** The date and time the resident chose, from whichever picker the service uses. */
const whenOf = (booking: AppointmentBooking): { date: string; time: string } => {
  if (booking.regular) {
    const { dateKey, selectedSlot } = booking.regularPicker;
    return {
      date: dateKey ? formatDateKey(dateKey) : NOT_SET,
      time: selectedSlot ? `${formatClock(selectedSlot.time)} to ${formatClock(slotEndTime(selectedSlot))}` : NOT_SET,
    };
  }
  const start = booking.slots.slotStart;
  return { date: start ? formatScheduleDate(start) : NOT_SET, time: start ? formatSlotTime(start) : NOT_SET };
};

/** Everything that will be sent, in the order the Details step asked for it. */
export const reviewRows = (booking: AppointmentBooking): ReviewRow[] => {
  const when = whenOf(booking);
  const rows: ReviewRow[] = [
    { label: "Service", value: booking.selectedService?.label ?? NOT_SET },
    { label: "Date", value: when.date },
    { label: "Time", value: when.time },
    { label: "Reason for visit", value: booking.reason.trim() || NOT_SET },
  ];
  const notes = booking.notes.trim();
  return notes ? [...rows, { label: "Additional notes", value: notes }] : rows;
};
