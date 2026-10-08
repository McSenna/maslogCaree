import { View } from "react-native";

import { TableEmptyState, TableErrorState, type DataTableProps } from "@/components/data-table";
import { Skeleton } from "@/components/ui/Skeleton";
import type { MasterListView } from "@/features/masterList/masterListView";

type EmptyCopy = Pick<DataTableProps<unknown>, "emptyIcon" | "emptyTitle" | "emptyDescription" | "emptyAction">;

export const MASTERLIST_ERROR = "Unable to load medical records.";

/** Nothing encoded yet, or nothing matching the filters. Only encoders get the add action. */
export const masterlistEmptyCopy = (
  filtered: boolean,
  canEncode: boolean,
  onClearFilters: () => void,
  onAdd: () => void
): EmptyCopy =>
  filtered
    ? {
        emptyIcon: "search",
        emptyTitle: "No medical records found",
        emptyDescription: "Nothing matches this search and these filters.",
        emptyAction: { label: "Clear filters", icon: "x", onPress: onClearFilters, variant: "outlined" },
      }
    : {
        emptyIcon: "file-text",
        emptyTitle: "No medical records found",
        emptyDescription:
          "Encode the health center's paper records here. Each one is filed under a resident on the barangay master list.",
        emptyAction: canEncode ? { label: "Add medical record", icon: "plus", onPress: onAdd } : undefined,
      };

type Props = {
  view: Exclude<MasterListView, "list">;
  canEncode: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onAdd: () => void;
};

/** The phone list's loading, error and empty states; the wide table draws the same ones itself. */
const MasterlistStates = ({ view, canEncode, onRetry, onClearFilters, onAdd }: Props) => {
  if (view === "loading") {
    return (
      <View accessible accessibilityLabel="Loading medical records" accessibilityRole="progressbar">
        {[0, 1, 2, 3, 4].map((row) => (
          <View key={row} className="min-h-16 gap-2 border-t border-divider px-3 py-3">
            <Skeleton className="h-3.5 w-[40%]" />
            <Skeleton className="h-3 w-[25%]" />
          </View>
        ))}
      </View>
    );
  }
  if (view === "error") return <TableErrorState title={MASTERLIST_ERROR} onRetry={onRetry} />;

  const copy = masterlistEmptyCopy(view === "noResults", canEncode, onClearFilters, onAdd);
  return (
    <TableEmptyState icon={copy.emptyIcon} title={copy.emptyTitle ?? ""} description={copy.emptyDescription} action={copy.emptyAction} />
  );
};

export default MasterlistStates;
