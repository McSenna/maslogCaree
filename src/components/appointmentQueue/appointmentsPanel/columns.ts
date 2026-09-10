/** Column weights, shared by the header and the rows so they cannot drift. */
export const COLUMNS = {
  index: 54,
  patient: 2.4,
  service: 1.6,
  date: 1.3,
  time: 1,
  status: 1.1,
  action: 132,
} as const;
