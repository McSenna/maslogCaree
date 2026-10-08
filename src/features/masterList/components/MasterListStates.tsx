import { View } from "react-native";

import { TableEmptyState, TableErrorState, type DataTableProps } from "@/components/data-table";
import { Skeleton } from "@/components/ui/Skeleton";

import type { MasterListView } from "../masterListView";

type EmptyCopy = Pick<DataTableProps<unknown>, "emptyIcon" | "emptyTitle" | "emptyDescription" | "emptyAction">;

export const MASTER_LIST_ERROR = "Could not load the master list.";

/** Nothing on the list yet, or nothing matching the search: different words and a different next step. */
export const masterListEmptyCopy = (filtered: boolean, onClearFilters: () => void, onAdd: () => void): EmptyCopy =>
  filtered
    ? {
        emptyIcon: "search",
        emptyTitle: "No records found",
        emptyDescription: "Nothing matches this search. Check the spelling or search by record ID.",
        emptyAction: { label: "Clear search", icon: "x", onPress: onClearFilters, variant: "outlined" },
      }
    : {
        emptyIcon: "users",
        emptyTitle: "No master list records yet",
        emptyDescription: "Add the barangay's official resident records here. Sign-ups are checked against this list.",
        emptyAction: { label: "Add record", icon: "plus", onPress: onAdd },
      };

const LoadingRows = () => (
  <View accessible accessibilityLabel="Loading master list records" accessibilityRole="progressbar">
    {[0, 1, 2, 3, 4].map((row) => (
      <View key={row} className="min-h-16 gap-2 border-t border-divider px-3 py-3">
        <Skeleton className="h-3.5 w-[40%]" />
        <Skeleton className="h-3 w-[25%]" />
      </View>
    ))}
  </View>
);

type Props = {
  view: Exclude<MasterListView, "list">;
  onRetry: () => void;
  onClearFilters: () => void;
  onAdd: () => void;
};

/** The phone list's loading, error and empty states; the wide table draws the same ones itself. */
const MasterListStates = ({ view, onRetry, onClearFilters, onAdd }: Props) => {
  if (view === "loading") return <LoadingRows />;
  if (view === "error") return <TableErrorState title={MASTER_LIST_ERROR} onRetry={onRetry} />;

  const copy = masterListEmptyCopy(view === "noResults", onClearFilters, onAdd);
  return (
    <TableEmptyState
      icon={copy.emptyIcon}
      title={copy.emptyTitle ?? ""}
      description={copy.emptyDescription}
      action={copy.emptyAction}
    />
  );
};

export default MasterListStates;
