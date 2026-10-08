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
