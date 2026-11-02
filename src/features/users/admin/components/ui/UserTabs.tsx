import { View } from "react-native";

import SegmentedControl, { type SegmentOption } from "@/components/dashboard/kit/SegmentedControl";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UserSummary, UserTab } from "../../userAdmin.types";
import { TAB_COUNT } from "../../userAdminModel";

type AccountTab = Exclude<UserTab, "masterlist">;

const TABS: readonly { value: AccountTab; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "requests", label: "Requests" },
  { value: "rejected", label: "Rejected" },
  { value: "deactivated", label: "Deactivated" },
  { value: "accounts", label: "All accounts" },
];

type UserTabsProps = {
  value: UserTab;
  summary: UserSummary | null;
  onChange: (value: UserTab) => void;
  /** Adds phone gutters. */
  gutter?: boolean;
};

/** The status segments. Counts come from the summary; until it loads they are left off rather than showing 0. */
const UserTabs = ({ value, summary, onChange, gutter }: UserTabsProps) => {
  const palette = useAdminSurfacePalette();
  const options: SegmentOption<AccountTab>[] = TABS.map((tab) => ({
    ...tab,
    count: summary ? TAB_COUNT[tab.value]?.(summary) : undefined,
  }));

  return (
    <View className={gutter ? "px-4" : undefined}>
      <SegmentedControl palette={palette} label="Account status" value={value as AccountTab} options={options} onChange={onChange} size="md" wrap />
    </View>
  );
};

export default UserTabs;
