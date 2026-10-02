/** Which of the five list states to draw. */
export type ScreenView = "loading" | "error" | "empty" | "noResults" | "list";

export const resolveView = (input: {
  isLoading: boolean;
  error: unknown;
  shown: number;
  filtered: boolean;
}): ScreenView => {
  if (input.isLoading) return "loading";
  if (input.error) return "error";
  if (input.shown > 0) return "list";
  return input.filtered ? "noResults" : "empty";
};

/** "Showing 21 to 40 of 52 users" */
export const rangeLine = (page: number, pageSize: number, shown: number, total: number): string => {
  if (total === 0) return "No users";
  const from = (page - 1) * pageSize + 1;
  return `Showing ${from} to ${from + shown - 1} of ${total} users`;
};

export const pageCount = (total: number, pageSize: number): number => Math.max(1, Math.ceil(total / pageSize));
