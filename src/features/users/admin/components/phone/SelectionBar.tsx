import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { ROLE_CHANGE_AVAILABLE } from "../../services/userAdminApi";

type SelectionBarProps = {
  selectedCount: number;
  reactivate: boolean;
  onClearSelection: () => void;
  onStatus: () => void;
};

/** Pinned above the list while rows are selected: what is selected and what can be done to it. */
const SelectionBar = ({ selectedCount, reactivate, onClearSelection, onStatus }: SelectionBarProps) => {
  const palette = useAdminSurfacePalette();
  if (selectedCount === 0) return null;

  return (
    <View accessibilityRole="toolbar" className="min-h-14 flex-row items-center gap-1 border-b border-selected-border bg-selected px-2">
      <DashboardButton palette={palette} variant="ghost" size="md" iconOnly icon="x" label="Clear selection" onPress={onClearSelection} />
      <Text accessibilityLiveRegion="polite" className="flex-1 text-[15px] font-semibold text-ink">
        {`${selectedCount} selected`}
      </Text>
      <DashboardButton
        palette={palette}
        variant={reactivate ? "secondary" : "danger"}
        size="md"
        iconOnly
        icon={reactivate ? "rotate-ccw" : "slash"}
        label={reactivate ? "Reactivate selected users" : "Deactivate selected users"}
        onPress={onStatus}
      />
      <DashboardButton
        palette={palette}
        variant="ghost"
        size="md"
        iconOnly
        icon="edit-2"
        label="Change role"
        onPress={() => undefined}
        disabled={!ROLE_CHANGE_AVAILABLE}
        accessibilityHint="Role changes are not available yet"
      />
    </View>
  );
};

export default SelectionBar;
