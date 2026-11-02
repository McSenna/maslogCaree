import { Text, View } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import OverviewCards from "./OverviewCards";
import UsersTabsRow from "./UsersTabsRow";

export const USERS_TITLE = "User management";

type UsersPageHeaderProps = {
  screen: UsersScreenState;
  /** Tighter cards for the list layout, which also covers portrait tablets. */
  compact?: boolean;
  /** The masterlist's main action, which sits at the end of the tabs row. */
  onAddRecord?: () => void;
};

/** The heading, cards and tabs row that both the accounts list and the masterlist sit under. */
const UsersPageHeader = ({ screen, compact = false, onAddRecord }: UsersPageHeaderProps) => {
  const { isMobile } = useResponsive();
  return (
    <View className={compact ? "gap-3" : "gap-4"}>
      <Text role="heading" aria-level={1} className="sr-only">{USERS_TITLE}</Text>
      <OverviewCards compact={compact} columns={isMobile ? 1 : 3} summary={screen.summary.data} tab={screen.filters.tab} onSelectTab={screen.setTab} />
      <UsersTabsRow screen={screen} onAddRecord={onAddRecord} />
    </View>
  );
};

export default UsersPageHeader;
