import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import BulkBar from "../shared/BulkBar";
import OverviewCards from "../shared/OverviewCards";
import UserFilters from "../shared/UserFilters";
import UserTabs from "../ui/UserTabs";
import { RequestHeadings, UserHeadings } from "./TableHeadings";
import { CardTop } from "@/components/dashboard/kit/TableCard";
import { TOOLBAR_ONE_ROW_WIDTH, type TableMode } from "./tableColumns";

type WideHeaderProps = {
  screen: UsersScreenState;
  mode: TableMode;
  width: number;
  onExport: () => void;
};

const SEARCH_WIDTH = { width: 300 };
const SEARCH_FILL = { flex: 1, minWidth: 220 };

export const USERS_TITLE = "Users";
export const USERS_SUBTITLE = "Accounts for health staff and residents who use the web and mobile app.";
export const MASTER_LIST_SUBTITLE = "The barangay's official resident records. A record is not an app account.";

/** The dashboard's page header, overview cards and toolbar, then the top of the table card. */
const WideHeader = ({ screen, mode, width, onExport }: WideHeaderProps) => {
  const palette = useAdminSurfacePalette();
  const { filters, view, selection, requestTab } = screen;
  const oneRow = width >= TOOLBAR_ONE_ROW_WIDTH;
  const showHeadings = view === "list" || view === "loading";
  const search = (
    <SearchField
      value={filters.queryInput}
      onChangeText={filters.setQuery}
      placeholder="Search name, email or location"
      accessibilityLabel="Search users"
      style={oneRow ? SEARCH_WIDTH : SEARCH_FILL}
    />
  );

  return (
    <View className="gap-4">
      <DashboardHeader
        palette={palette}
        compact={false}
        title={USERS_TITLE}
        subtitle={USERS_SUBTITLE}
        secondaryActions={requestTab ? [] : [{ key: "export", label: "Export CSV", icon: "download", onPress: onExport }]}
      />

      <OverviewCards summary={screen.summary.data} tab={filters.tab} onSelectTab={screen.setTab} onShowNewest={screen.showNewest} newestSelected={screen.filters.tab === "accounts" && screen.filters.sort === "joined_desc"} columns={width >= 900 ? 4 : 2} />

      <View className={oneRow ? "flex-row items-center justify-between gap-4" : "gap-3"}>
        <UserTabs value={filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
        <View className={`flex-row flex-wrap items-center gap-2 ${oneRow ? "" : "w-full"}`}>
          {search}
          {requestTab ? null : <UserFilters filters={filters} fixed={oneRow || mode !== "tablet"} height={CONTROL_HEIGHT} />}
        </View>
      </View>

      {selection.count > 0 ? (
        <BulkBar
          count={selection.count}
          reactivate={filters.tab === "deactivated"}
          onStatus={() => screen.changeStatus(screen.selectedUsers, filters.tab === "deactivated" ? "reactivate" : "deactivate")}
          onClear={selection.clear}
        />
      ) : null}

      {/* Empty and error states still sit in the table card, without headings that label nothing. */}
      <CardTop>
        {showHeadings && requestTab ? <RequestHeadings mode={mode} pending={filters.tab === "requests"} /> : null}
        {showHeadings && !requestTab ? <UserHeadings mode={mode} selection={selection} /> : null}
      </CardTop>
    </View>
  );
};


export default WideHeader;
