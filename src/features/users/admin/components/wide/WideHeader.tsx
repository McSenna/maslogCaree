import { View } from "react-native";

import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import UserFilters from "../shared/UserFilters";
import UsersPageHeader from "../shared/UsersPageHeader";
import UserTabs from "../ui/UserTabs";
import { TOOLBAR_ONE_ROW_WIDTH } from "./tableColumns";

type WideHeaderProps = {
  screen: UsersScreenState;
  width: number;
};

const SEARCH_WIDTH = { width: 300 };
const SEARCH_FILL = { flex: 1, minWidth: 220 };

/** The page header, then the segments, search and filters above the users table. */
const WideHeader = ({ screen, width }: WideHeaderProps) => {
  const { filters } = screen;
  const oneRow = width >= TOOLBAR_ONE_ROW_WIDTH;

  return (
    <View className="gap-4">
      <UsersPageHeader screen={screen} />
      <View className={oneRow ? "flex-row items-center justify-between gap-4" : "gap-3"}>
        <UserTabs value={filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
        <View className={`flex-row flex-wrap items-center gap-2 ${oneRow ? "" : "w-full"}`}>
          <SearchField
            value={filters.queryInput}
            onChangeText={filters.setQuery}
            placeholder="Search name, email or location"
            accessibilityLabel="Search accounts"
            style={oneRow ? SEARCH_WIDTH : SEARCH_FILL}
          />
          <UserFilters filters={filters} fixed height={CONTROL_HEIGHT} />
        </View>
      </View>
    </View>
  );
};

export default WideHeader;
