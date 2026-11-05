/**
 * Which appointment another screen asked the appointments screen to open. It is
 * held in memory because record IDs must never appear in a URL.
 */
let requestedId: string | null = null;

export const requestAppointmentDetail = (id: string): void => {
  requestedId = id;
};

/** Read once: taking it clears it, so the sheet does not reopen on a later visit. */
export const takeAppointmentDetailRequest = (): string | null => {
  const id = requestedId;
  requestedId = null;
  return id;
};
