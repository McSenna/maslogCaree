import { View } from "react-native";

import { TableEmptyState, TableErrorState, type DataTableProps } from "@/components/data-table";
import { Skeleton } from "@/components/ui/Skeleton";

type EmptyCopy = Pick<DataTableProps<unknown>, "emptyIcon" | "emptyTitle" | "emptyDescription" | "emptyAction">;

export const ANNOUNCEMENTS_ERROR = "Could not load announcements.";

/** Nothing posted yet, or nothing matching the search and filters. */
export const announcementsEmptyCopy = (filtered: boolean, onCreate: () => void, onClear: () => void): EmptyCopy =>
  filtered
    ? {
        emptyIcon: "search",
        emptyTitle: "No announcements found",
        emptyDescription: "Nothing matches the current search and filters.",
        emptyAction: { label: "Clear filters", icon: "x", onPress: onClear, variant: "outlined" },
      }
    : {
        emptyIcon: "volume-2",
        emptyTitle: "No announcements yet",
        emptyDescription: "Create an announcement to share it with patients and staff.",
        emptyAction: { label: "New announcement", icon: "edit-2", onPress: onCreate },
      };

const SkeletonRow = ({ first = false }: { first?: boolean }) => (
  <View className={`gap-2.5 px-3 py-4 ${first ? "" : "border-t border-divider"}`}>
    <Skeleton className="h-4 w-[60%]" />
    <Skeleton className="h-3.5 w-[90%]" />
    <Skeleton className="h-3 w-[40%]" />
  </View>
);

/** First load on phones: four blocks shaped like rows. */
export const LoadingRows = () => (
  <View accessible accessibilityLabel="Loading announcements" accessibilityRole="progressbar">
    <SkeletonRow first />
    <SkeletonRow />
    <SkeletonRow />
    <SkeletonRow />
  </View>
);

export const LoadError = ({ onRetry }: { onRetry: () => void }) => <TableErrorState title={ANNOUNCEMENTS_ERROR} onRetry={onRetry} />;

export const EmptyAnnouncements = ({ filtered, onCreate, onClear }: { filtered: boolean; onCreate: () => void; onClear: () => void }) => {
  const copy = announcementsEmptyCopy(filtered, onCreate, onClear);
  return <TableEmptyState icon={copy.emptyIcon} title={copy.emptyTitle ?? ""} description={copy.emptyDescription} action={copy.emptyAction} />;
};
