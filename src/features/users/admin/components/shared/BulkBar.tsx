import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { ROLE_CHANGE_AVAILABLE } from "../../services/userAdminApi";

type BulkBarProps = {
  count: number;
  /** On the Deactivated tab the action brings accounts back. */
  reactivate: boolean;
  onStatus: () => void;
  onClear: () => void;
};

/** Shown while one or more rows are checked. */
const BulkBar = ({ count, reactivate, onStatus, onClear }: BulkBarProps) => {
  const palette = useAdminSurfacePalette();
  return (
    <View accessibilityRole="toolbar" accessibilityLabel="Selected users" className="min-h-12 flex-row flex-wrap items-center gap-2 rounded-control border border-selected-border bg-selected py-1.5 pl-4 pr-2">
      <Text accessibilityLiveRegion="polite" className="mr-auto text-[14px] font-semibold text-ink">
        {count === 1 ? "1 user selected" : `${count} users selected`}
      </Text>
      <DashboardButton
        palette={palette}
        label="Change role"
        icon="edit-2"
        // NOTE: stays disabled until the role-change endpoint exists (see userAdminApi).
        onPress={() => undefined}
        disabled={!ROLE_CHANGE_AVAILABLE}
        accessibilityHint={ROLE_CHANGE_AVAILABLE ? undefined : "Role changes are not available yet"}
      />
      <DashboardButton
        palette={palette}
        label={reactivate ? "Reactivate" : "Deactivate"}
        icon={reactivate ? "rotate-ccw" : "slash"}
        variant={reactivate ? "secondary" : "danger"}
        onPress={onStatus}
      />
      <DashboardButton palette={palette} label="Clear selection" variant="link" onPress={onClear} />
    </View>
  );
};

export default BulkBar;
