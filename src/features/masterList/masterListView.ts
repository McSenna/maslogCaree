// Import-free so `node --test` can load it.
export type MasterListView = "loading" | "error" | "empty" | "noResults" | "list";

export const resolveMasterListView = (input: {
  isLoading: boolean;
  error: unknown;
  shown: number;
  filtered: boolean;
}): MasterListView => {
  if (input.isLoading) return "loading";
  if (input.error) return "error";
  if (input.shown > 0) return "list";
  return input.filtered ? "noResults" : "empty";
};
