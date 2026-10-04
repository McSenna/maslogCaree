import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import OverviewCards from "../shared/OverviewCards";
import UserFilters from "../shared/UserFilters";
import UserTabs from "../ui/UserTabs";
import { CardTop } from "@/components/dashboard/kit/TableCard";
import { USERS_SUBTITLE, USERS_TITLE } from "../wide/WideHeader";

type PhoneListHeaderProps = {
  screen: UsersScreenState;
  width: number;
  onExport: () => void;
};

/** The dashboard's compact header, cards and controls: the list's header, so they scroll with the rows. */
const PhoneListHeader = ({ screen, width, onExport }: PhoneListHeaderProps) => {
  const palette = useAdminSurfacePalette();
  const { filters, requestTab } = screen;

  return (
    <View className="gap-3 pb-3 pt-4">
      <View className="gap-3 px-4">
        <DashboardHeader
          palette={palette}
          compact
          title={USERS_TITLE}
          subtitle={USERS_SUBTITLE}
          secondaryActions={requestTab ? [] : [{ key: "export", label: "Export CSV", icon: "download", onPress: onExport, showOnPhone: true }]}
        />
        <OverviewCards compact dense={width < 360} columns={2} summary={screen.summary.data} tab={filters.tab} onSelectTab={screen.setTab} onShowNewest={screen.showNewest} newestSelected={screen.filters.tab === "accounts" && screen.filters.sort === "joined_desc"} />
      </View>

      <UserTabs scroll value={filters.tab} summary={screen.summary.data} onChange={screen.setTab} />

      {/* Search sits under the tabs, as on the Masterlist tab, with the filters it combines with. */}
      <View className="gap-2 px-4">
        <SearchField
          value={filters.queryInput}
          onChangeText={filters.setQuery}
          // The full hint is cut off below about 360px of content width (a 375px phone).
          placeholder={width >= 360 ? "Search name, email or location" : "Search users"}
          accessibilityLabel="Search users"
        />
        {requestTab ? null : <UserFilters filters={filters} height={CONTROL_HEIGHT} />}
      </View>

      <View className="mx-4">
        <CardTop />
      </View>
    </View>
  );
};

export default PhoneListHeader;
