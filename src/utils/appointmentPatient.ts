type PatientLike = {
  childName?: string | null;
  childDateOfBirth?: string | null;
  resident?: { fullname?: string; dateOfBirth?: string } | null;
};

export const isChildVisit = (appointment: PatientLike): boolean => Boolean(appointment.childName?.trim());

export const appointmentPatientName = (appointment: PatientLike, fallback = "Unnamed patient"): string =>
  appointment.childName?.trim() || appointment.resident?.fullname?.trim() || fallback;

export const appointmentPatientBirthDate = (appointment: PatientLike): string | null =>
  (isChildVisit(appointment) ? appointment.childDateOfBirth : appointment.resident?.dateOfBirth) ?? null;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

/** "Jan 10, 2025" for a stored birth date (Manila midnight), on the barangay's calendar. */
export const formatChildBirthDate = (value: string): string => {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  const day = new Date(time + MANILA_OFFSET_MS);
  return `${MONTHS[day.getUTCMonth()]} ${day.getUTCDate()}, ${day.getUTCFullYear()}`;
};

/** "Parent: Juan Dela Cruz" under a child's name in staff lists, so the account is still findable. */
export const guardianLine = (appointment: PatientLike): string | null => {
  const parent = appointment.resident?.fullname?.trim();
  return isChildVisit(appointment) && parent ? `Parent: ${parent}` : null;
};

/** One line for staff under a child's name: birth date and parent. Null for other visits. */
export const childCaption = (appointment: PatientLike): string | null => {
  if (!isChildVisit(appointment)) return null;
  const born = appointment.childDateOfBirth ? `Born ${formatChildBirthDate(appointment.childDateOfBirth)}` : null;
  return [born, guardianLine(appointment)].filter(Boolean).join(" · ") || null;
};
