import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import DashboardErrorState from "@/components/dashboard/admin/DashboardErrorState";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { MasterListView } from "@/features/masterList/masterListView";

const LoadingRows = () => (
  <View accessible accessibilityLabel="Loading medical records" accessibilityRole="progressbar">
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
  canEncode: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onAdd: () => void;
};

/** What the table area shows instead of records: loading, error, nothing yet, or nothing matching. */
const MasterlistStates = ({ view, canEncode, onRetry, onClearFilters, onAdd }: Props) => {
  const palette = useAdminSurfacePalette();
  if (view === "loading") return <LoadingRows />;
  if (view === "error") {
    return (
      <View className="p-3">
        <DashboardErrorState
          palette={palette}
          title="Unable to load medical records."
          message="Check your connection and try again."
          retryLabel="Try loading medical records again"
          onRetry={onRetry}
        />
      </View>
    );
  }
  if (view === "noResults") {
    return (
      <EmptyPanelState palette={palette} icon="search" title="No medical records found" message="Nothing matches this search and these filters.">
        <DashboardButton palette={palette} variant="link" label="Clear filters" onPress={onClearFilters} />
      </EmptyPanelState>
    );
  }
  return (
    <EmptyPanelState
      palette={palette}
      icon="file-text"
      title="No medical records found"
      message="Encode the health center's paper records here. Each one is filed under a resident on the barangay master list."
    >
      {canEncode ? <DashboardButton palette={palette} variant="primary" icon="plus" label="Add medical record" onPress={onAdd} /> : null}
    </EmptyPanelState>
  );
};

export default MasterlistStates;
