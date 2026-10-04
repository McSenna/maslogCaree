import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import DashboardErrorState from "@/components/dashboard/admin/DashboardErrorState";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterListView } from "../masterListView";

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

/** What the table area shows instead of records: loading, error, nothing yet, or nothing matching. */
const MasterListStates = ({ view, onRetry, onClearFilters, onAdd }: Props) => {
  const palette = useAdminSurfacePalette();
  if (view === "loading") return <LoadingRows />;
  if (view === "error") {
    return (
      <View className="p-3">
        <DashboardErrorState
          palette={palette}
          title="Could not load the master list."
          message="Check your connection and try again."
          retryLabel="Retry loading the master list"
          onRetry={onRetry}
        />
      </View>
    );
  }
  if (view === "noResults") {
    return (
      <EmptyPanelState palette={palette} icon="search" title="No records found" message="Nothing matches this search and status.">
        <DashboardButton palette={palette} variant="link" label="Clear search" onPress={onClearFilters} />
      </EmptyPanelState>
    );
  }
  return (
    <EmptyPanelState
      palette={palette}
      icon="list"
      title="No master list records yet"
      message="Add the barangay's official resident records here. Sign-ups are checked against this list."
    >
      <DashboardButton palette={palette} variant="primary" icon="plus" label="Add record" onPress={onAdd} />
    </EmptyPanelState>
  );
};

export default MasterListStates;
