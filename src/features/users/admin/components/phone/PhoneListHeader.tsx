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
  onAddUser: () => void;
};

/** The dashboard's compact header, cards and controls: the list's header, so they scroll with the rows. */
const PhoneListHeader = ({ screen, width, onExport, onAddUser }: PhoneListHeaderProps) => {
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
          primaryAction={{ key: "add", label: "Add user", icon: "user-plus", onPress: onAddUser }}
          secondaryActions={requestTab ? [] : [{ key: "export", label: "Export CSV", icon: "download", onPress: onExport, showOnPhone: true }]}
        />
        <SearchField
          value={filters.queryInput}
          onChangeText={filters.setQuery}
          // The full hint is cut off below about 360px of content width (a 375px phone).
          placeholder={width >= 360 ? "Search name, email or location" : "Search users"}
          accessibilityLabel="Search users"
        />
        <OverviewCards compact dense={width < 360} columns={2} summary={screen.summary.data} tab={filters.tab} onSelectTab={screen.setTab} />
      </View>

      <UserTabs scroll value={filters.tab} summary={screen.summary.data} onChange={screen.setTab} />

      {requestTab ? null : (
        <View className="px-4">
          <UserFilters filters={filters} height={CONTROL_HEIGHT} />
        </View>
      )}

      <View className="mx-4">
        <CardTop />
      </View>
    </View>
  );
};

export default PhoneListHeader;
