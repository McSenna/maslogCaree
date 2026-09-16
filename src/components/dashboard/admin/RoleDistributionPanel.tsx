import { useMemo, useState } from "react";
import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { RoleDistributionEntry } from "@/services/adminDashboardService";
import PanelCard from "./PanelCard";
import RoleDonutChart, { type RoleFilter } from "./RoleDonutChart";

type RoleDistributionPanelProps = {
  palette: AdminDashboardPalette;
  distribution: RoleDistributionEntry[];
  stacked?: boolean;
  size?: number;
  fill?: boolean;
};

const RoleDistributionPanel = ({
  palette,
  distribution,
  stacked = false,
  size,
  fill = false,
}: RoleDistributionPanelProps) => {
  const [activeRole, setActiveRole] = useState<RoleFilter>("all");

  const options = useMemo<SelectOption<RoleFilter>[]>(
    () => [
      { value: "all", label: "All Users" },
      ...distribution.map((entry) => ({ value: entry.role, label: entry.label })),
    ],
    [distribution]
  );

  return (
    <PanelCard
      palette={palette}
      title="User Distribution by Role"
      icon="users"
      subtitle="Breakdown of total users by their assigned role"
      headerRight={
        <SelectMenu
          label="Filter by role"
          value={activeRole}
          options={options}
          onChange={setActiveRole}
          height={34}
          style={{ minWidth: 116 }}
        />
      }
      fill={fill}
      centerContent
    >
      <RoleDonutChart
        palette={palette}
        distribution={distribution}
        stacked={stacked}
        size={size}
        activeRole={activeRole}
      />
    </PanelCard>
  );
};

export default RoleDistributionPanel;
