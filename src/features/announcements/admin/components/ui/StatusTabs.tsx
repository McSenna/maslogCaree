import { ScrollView } from "react-native";

import SegmentedControl, { type SegmentOption } from "@/components/dashboard/kit/SegmentedControl";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { StatusCounts, StatusFilter } from "../../adminAnnouncement.types";

const TABS: readonly { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "expired", label: "Expired" },
];

type StatusTabsProps = {
  value: StatusFilter;
  counts: StatusCounts;
  onChange: (value: StatusFilter) => void;
  /** Phones scroll the control sideways rather than squeezing the labels. */
  scroll?: boolean;
};

/** The dashboard's segmented control, one segment per status with its count. */
const StatusTabs = ({ value, counts, onChange, scroll }: StatusTabsProps) => {
  const palette = useAdminSurfacePalette();
  const options: SegmentOption<StatusFilter>[] = TABS.map((tab) => ({ ...tab, count: counts[tab.value] }));
  const control = <SegmentedControl palette={palette} label="Announcement status" value={value} options={options} onChange={onChange} />;

  if (!scroll) return control;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4">
      {control}
    </ScrollView>
  );
};

export default StatusTabs;
