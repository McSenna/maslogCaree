// Shown above the services list. Each line matches how that service is scheduled.
export const BOOKING_NOTE =
  "BP checking and prenatal visits are confirmed when you pick a date and time. General checkups and consultations join the doctor's queue, and their date and time are assigned for you. Baby immunization visits are assigned automatically on Thursdays from the verified vaccine schedule.";

export const CONFIRMED_MESSAGE =
  "Your time is reserved. You can find this appointment under Appointments, and the details are in your notifications.";

// Queued doctor services (general checkup, consultation). The order matches the
// backend priority groups in utils/priorityQueue.js; keep the two in step.
export const QUEUE_NOTE_TITLE = "You do not choose a date for this service";

export const QUEUE_NOTE_BODY =
  "Your request joins the doctor's queue. When a medical mission has an open time, your date and time are assigned and you get a notification.";

export const QUEUE_ORDER_NOTE =
  "Infants and adults 60 and older are scheduled first, then children and teens, then adults 18 to 59. Within each group, earlier requests go first.";

export const QUEUE_REVIEW_NOTE =
  "Sending this request does not reserve a time yet. You will be notified when your date and time are assigned.";

export const QUEUED_TITLE = "Request queued";

export const QUEUED_MESSAGE =
  "Your appointment request has been queued. Your appointment date and time will be assigned when a doctor's medical mission schedule becomes available. We will notify you once it is scheduled.";

export const SCHEDULED_FROM_QUEUE_MESSAGE =
  "A doctor's medical mission had an open time, so your date and time are already assigned. The details are in your notifications.";

export const TO_BE_ASSIGNED = "To be assigned";

// One doctor request waits per resident; the server refuses a second with the same advice.
export const QUEUE_WAITING_TITLE = "You already have a doctor request in the queue";

export const queueWaitingBody = (serviceLabel: string): string =>
  `Your ${serviceLabel.toLowerCase()} request is still waiting for a date and time. You can send a new doctor request once it is scheduled. To change it, cancel it from your appointments first.`;
