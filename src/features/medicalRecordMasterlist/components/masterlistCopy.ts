export const MASTERLIST_TITLE = "Medical records";
export const MASTERLIST_SUBTITLE =
  "Health center records for residents on the barangay master list, including paper records from before MaslogCare.";

export const rangeLine = (page: number, pageSize: number, shown: number, total: number) => {
  if (total === 0) return "No records";
  const start = (page - 1) * pageSize + 1;
  return `${start} to ${start + shown - 1} of ${total} records`;
};
