import { View } from "react-native";

import { CardTop } from "@/components/dashboard/kit/TableCard";
import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import UserFilters from "../shared/UserFilters";
import UsersPageHeader from "../shared/UsersPageHeader";
import UserTabs from "../ui/UserTabs";

type PhoneListHeaderProps = {
  screen: UsersScreenState;
  width: number;
};

/** The compact header, cards and controls: the list's header, so they scroll with the rows. */
const PhoneListHeader = ({ screen, width }: PhoneListHeaderProps) => {
  const { filters } = screen;

  return (
    <View className="gap-3 pb-3 pt-4">
      <View className="px-4">
        <UsersPageHeader screen={screen} compact />
      </View>

      <UserTabs gutter value={filters.tab} summary={screen.summary.data} onChange={screen.setTab} />

      <View className="gap-2 px-4">
        <SearchField
          value={filters.queryInput}
          onChangeText={filters.setQuery}
          // The full hint is cut off below about 360px of content width (a 375px phone).
          placeholder={width >= 360 ? "Search name, email or location" : "Search accounts"}
          accessibilityLabel="Search accounts"
        />
        <UserFilters filters={filters} height={CONTROL_HEIGHT} />
      </View>

      <View className="mx-4">
        <CardTop />
      </View>
    </View>
  );
};

export default PhoneListHeader;
