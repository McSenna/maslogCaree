import { ScrollView } from "react-native";

import SegmentedControl, { type SegmentOption } from "@/components/dashboard/kit/SegmentedControl";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UserSummary, UserTab } from "../../userAdmin.types";
import { TAB_COUNT } from "../../userAdminModel";

const TABS: readonly { value: UserTab; label: string }[] = [
  { value: "active", label: "Active users" },
  { value: "requests", label: "Requests" },
  { value: "rejected", label: "Rejected" },
  { value: "deactivated", label: "Deactivated" },
  { value: "masterlist", label: "Masterlist" },
];

type UserTabsProps = {
  value: UserTab;
  summary: UserSummary | null;
  onChange: (value: UserTab) => void;
  /** Narrow screens scroll the control sideways rather than squeezing five labels. */
  scroll?: boolean;
};

/**
 * The dashboard's segmented control, one segment per list. Counts come from
 * the summary; until it loads they are left off rather than showing 0.
 */
const UserTabs = ({ value, summary, onChange, scroll }: UserTabsProps) => {
  const palette = useAdminSurfacePalette();
  const options: SegmentOption<UserTab>[] = TABS.map((tab) => ({
    ...tab,
    count: summary ? TAB_COUNT[tab.value](summary) : undefined,
  }));
  const control = <SegmentedControl palette={palette} label="User lists" value={value} options={options} onChange={onChange} />;

  if (!scroll) return control;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4">
      {control}
    </ScrollView>
  );
};

export default UserTabs;
