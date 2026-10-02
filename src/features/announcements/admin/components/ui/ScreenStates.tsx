import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import DashboardErrorState from "@/components/dashboard/admin/DashboardErrorState";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

const SkeletonRow = ({ first = false }: { first?: boolean }) => (
  <View className={`gap-2.5 px-3 py-4 ${first ? "" : "border-t border-divider"}`}>
    <Skeleton className="h-4 w-[60%]" />
    <Skeleton className="h-3.5 w-[90%]" />
    <Skeleton className="h-3 w-[40%]" />
  </View>
);

/** First load only: four blocks shaped like rows, pulsing like the dashboard's skeletons. */
export const LoadingRows = () => (
  <View accessible accessibilityLabel="Loading announcements" accessibilityRole="progressbar">
    <SkeletonRow first />
    <SkeletonRow />
    <SkeletonRow />
    <SkeletonRow />
  </View>
);

export const LoadError = ({ onRetry }: { onRetry: () => void }) => {
  const palette = useAdminSurfacePalette();
  return (
    <View className="p-3">
      <DashboardErrorState
        palette={palette}
        title="Could not load announcements."
        message="Check your connection and try again."
        retryLabel="Retry loading announcements"
        onRetry={onRetry}
      />
    </View>
  );
};

export const NoAnnouncements = ({ onCreate }: { onCreate: () => void }) => {
  const palette = useAdminSurfacePalette();
  return (
    <EmptyPanelState palette={palette} icon="volume-2" title="No announcements yet" message="Create an announcement to share it with patients and staff.">
      <DashboardButton palette={palette} variant="primary" size="md" icon="edit-2" label="New announcement" onPress={onCreate} />
    </EmptyPanelState>
  );
};

export const NoResults = ({ onClear }: { onClear: () => void }) => {
  const palette = useAdminSurfacePalette();
  return (
    <EmptyPanelState palette={palette} icon="search" title="No announcements found" message="Nothing matches the current search and filters.">
      <DashboardButton palette={palette} variant="link" label="Clear filters" onPress={onClear} />
    </EmptyPanelState>
  );
};
