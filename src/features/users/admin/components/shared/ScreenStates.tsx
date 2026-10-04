import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import DashboardErrorState from "@/components/dashboard/admin/DashboardErrorState";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { ScreenView } from "../../hooks/screenView";
import type { UserTab } from "../../userAdmin.types";

const EMPTY: Record<UserTab, { title: string; message: string; icon: "users" | "user-plus" | "user-x" | "slash" | "list" }> = {
  active: { title: "No active users", message: "Add a user to give them access to the app.", icon: "users" },
  requests: { title: "No pending requests", message: "New sign-up requests from residents will appear here.", icon: "user-plus" },
  rejected: { title: "No rejected requests", message: "Requests you decline will be listed here.", icon: "user-x" },
  deactivated: { title: "No deactivated users", message: "Accounts you deactivate will be listed here and can be restored.", icon: "slash" },
  accounts: { title: "No registered users", message: "Every registered account, active or deactivated, will be listed here.", icon: "users" },
  masterlist: { title: "No master list records", message: "The barangay's official resident records will be listed here.", icon: "list" },
};

/** One row-shaped placeholder, inset like the rows it stands in for (and the Masterlist's skeleton). */
const SkeletonRow = ({ phone }: { phone?: boolean }) => (
  <View className={`flex-row items-center gap-3 border-t border-divider ${phone ? "px-1 py-3" : "min-h-16 px-3 py-3"}`}>
    <Skeleton className={`${phone ? "h-10 w-10" : "h-8 w-8"} rounded-full`} />
    <View className="min-w-0 flex-1 gap-2">
      <Skeleton className="h-3.5 w-[40%]" />
      <Skeleton className="h-3 w-[60%]" />
    </View>
    {phone ? null : (
      <>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </>
    )}
  </View>
);

export const LoadingRows = ({ phone }: { phone?: boolean }) => (
  <View accessible accessibilityLabel="Loading users" accessibilityRole="progressbar">
    {[0, 1, 2, 3, 4].map((row) => (
      <SkeletonRow key={row} phone={phone} />
    ))}
  </View>
);

type ListStateProps = {
  view: Exclude<ScreenView, "list">;
  tab: UserTab;
  phone?: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
};

/** What the table area shows in place of rows: loading, error, nothing yet, or nothing matching. */
const ListState = ({ view, tab, phone, onRetry, onClearFilters }: ListStateProps) => {
  const palette = useAdminSurfacePalette();
  if (view === "loading") return <LoadingRows phone={phone} />;
  if (view === "error") {
    return (
      <View className="p-3">
        <DashboardErrorState
          palette={palette}
          title="Could not load users."
          message="Check your connection and try again."
          retryLabel="Retry loading users"
          onRetry={onRetry}
        />
      </View>
    );
  }
  if (view === "noResults") {
    return (
      <EmptyPanelState palette={palette} icon="search" title="No users found" message="Nothing matches the current search and filters.">
        <DashboardButton palette={palette} variant="link" label="Clear filters" onPress={onClearFilters} />
      </EmptyPanelState>
    );
  }
  const empty = EMPTY[tab];
  return <EmptyPanelState palette={palette} icon={empty.icon} title={empty.title} message={empty.message} />;
};

export default ListState;
