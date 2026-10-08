import { View } from "react-native";

import { TableEmptyState, TableErrorState, type DataTableProps } from "@/components/data-table";
import { Skeleton } from "@/components/ui/Skeleton";

import type { ScreenView } from "../../hooks/screenView";
import type { UserTab } from "../../userAdmin.types";

type EmptyCopy = Pick<DataTableProps<unknown>, "emptyIcon" | "emptyTitle" | "emptyDescription" | "emptyAction">;

export const USERS_ERROR = "Could not load users.";

const EMPTY: Record<UserTab, Required<Pick<EmptyCopy, "emptyIcon" | "emptyTitle" | "emptyDescription">>> = {
  active: { emptyTitle: "No active users", emptyDescription: "Add a user to give them access to the app.", emptyIcon: "users" },
  requests: { emptyTitle: "No pending requests", emptyDescription: "New sign-up requests from residents will appear here.", emptyIcon: "user-plus" },
  rejected: { emptyTitle: "No rejected requests", emptyDescription: "Requests you decline will be listed here.", emptyIcon: "user-x" },
  deactivated: { emptyTitle: "No deactivated users", emptyDescription: "Accounts you deactivate will be listed here and can be restored.", emptyIcon: "slash" },
  accounts: { emptyTitle: "No registered users", emptyDescription: "Every registered account, active or deactivated, will be listed here.", emptyIcon: "users" },
  masterlist: { emptyTitle: "No master list records", emptyDescription: "The barangay's official resident records will be listed here.", emptyIcon: "list" },
};

/** Nothing in this tab yet, or nothing matching the search and filters. */
export const usersEmptyCopy = (tab: UserTab, filtered: boolean, onClearFilters: () => void): EmptyCopy =>
  filtered
    ? {
        emptyIcon: "search",
        emptyTitle: "No users found",
        emptyDescription: "Nothing matches the current search and filters.",
        emptyAction: { label: "Clear filters", icon: "x", onPress: onClearFilters, variant: "outlined" },
      }
    : EMPTY[tab];

const SkeletonRow = () => (
  <View className="flex-row items-center gap-3 border-t border-divider px-1 py-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <View className="min-w-0 flex-1 gap-2">
      <Skeleton className="h-3.5 w-[40%]" />
      <Skeleton className="h-3 w-[60%]" />
    </View>
  </View>
);

type ListStateProps = {
  view: Exclude<ScreenView, "list">;
  tab: UserTab;
  onRetry: () => void;
  onClearFilters: () => void;
};

/** The phone list's loading, error and empty states; the wide table draws the same ones itself. */
const ListState = ({ view, tab, onRetry, onClearFilters }: ListStateProps) => {
  if (view === "loading") {
    return (
      <View accessible accessibilityLabel="Loading users" accessibilityRole="progressbar">
        {[0, 1, 2, 3, 4].map((row) => (
          <SkeletonRow key={row} />
        ))}
      </View>
    );
  }
  if (view === "error") return <TableErrorState title={USERS_ERROR} onRetry={onRetry} />;

  const copy = usersEmptyCopy(tab, view === "noResults", onClearFilters);
  return (
    <TableEmptyState icon={copy.emptyIcon} title={copy.emptyTitle ?? ""} description={copy.emptyDescription} action={copy.emptyAction} />
  );
};

export default ListState;
