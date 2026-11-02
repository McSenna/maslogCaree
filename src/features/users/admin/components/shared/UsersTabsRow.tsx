import { Platform, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import GlobalAccessToggle from "@/features/webAccess/GlobalAccessToggle";
import { useCanManageWebAccess } from "@/features/webAccess/webAccessPermission";
import { useResponsive } from "@/hooks/useResponsive";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import UsersViewTab from "../ui/UsersViewTab";

const MASTERLIST_NAME = "Resident masterlist";
// Below this, both tabs with icons and a four-digit count no longer fit side by side.
const TAB_ICONS_MIN_WIDTH = 400;

type UsersTabsRowProps = {
  screen: UsersScreenState;
  onAddRecord?: () => void;
};

/** The two data sets, then the page's actions at the end of the same row, on one bottom rule. */
const UsersTabsRow = ({ screen, onAddRecord }: UsersTabsRowProps) => {
  const palette = useAdminSurfacePalette();
  const { isMobile, width } = useResponsive();
  const canManageWebAccess = useCanManageWebAccess();
  const showTabIcons = width >= TAB_ICONS_MIN_WIDTH;
  // The file is account data, and a phone's share sheet is no place for it.
  const showExport = !screen.masterTab && Platform.OS === "web";

  const tabs = (
    <View accessibilityRole="tablist" accessibilityLabel="User data" className="min-w-0 flex-row items-center gap-1">
      <UsersViewTab icon={showTabIcons ? "user" : undefined} label={showTabIcons ? "User accounts" : "Accounts"} accessibilityLabel="User accounts" selected={!screen.masterTab} onPress={() => screen.setTab("active")} />
      <UsersViewTab
        icon={showTabIcons ? "users" : undefined}
        // Both tabs must fit a 320px screen side by side, so phones use short names.
        label={isMobile ? "Masterlist" : MASTERLIST_NAME}
        accessibilityLabel={MASTERLIST_NAME}
        count={screen.summary.data?.masterlist}
        selected={screen.masterTab}
        onPress={() => screen.setTab("masterlist")}
      />
    </View>
  );

  const actions = (
    <View className={`max-w-full flex-row flex-wrap items-center gap-3 ${isMobile ? "w-full" : ""}`}>
      {canManageWebAccess ? <GlobalAccessToggle /> : null}
      {canManageWebAccess && (showExport || onAddRecord) ? (
        isMobile ? null : <View className="h-7 w-px bg-divider" accessibilityElementsHidden importantForAccessibility="no" />
      ) : null}
      {/* ml-auto holds the action at the right edge, even when it wraps onto its own line. */}
      {showExport ? (
        <View className="ml-auto">
          <DashboardButton
            palette={palette}
            variant="outline"
            size="md"
            icon="download"
            label="Export"
            accessibilityLabel="Export this list as a CSV file"
            loading={screen.exporting}
            disabled={screen.total === 0}
            onPress={screen.exportList}
          />
        </View>
      ) : null}
      {onAddRecord ? (
        <View className="ml-auto">
          <DashboardButton palette={palette} variant="primary" size="md" icon="plus" label="Add record" accessibilityLabel="Add resident record" onPress={onAddRecord} />
        </View>
      ) : null}
    </View>
  );

  if (isMobile) {
    return (
      <View className="gap-3">
        <View className="border-b border-divider">{tabs}</View>
        {actions}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap items-end justify-between gap-x-4 border-b border-divider">
      {tabs}
      <View className="ml-auto max-w-full pb-1.5">{actions}</View>
    </View>
  );
};

export default UsersTabsRow;
