import MetricCard from "@/components/dashboard/admin/MetricCard";
import MetricCardSkeleton from "@/components/dashboard/admin/MetricCardSkeleton";
import { MetricRow } from "@/components/dashboard/kit/DashboardLayout";
import type { MetricCardProps } from "@/components/dashboard/admin/MetricCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UserSummary, UserTab } from "../../userAdmin.types";
import { activeShareNote } from "../../userAdminModel";

type OverviewCardsProps = {
  summary: UserSummary | null;
  tab: UserTab;
  onSelectTab: (tab: UserTab) => void;
  /** Three in a row when there is room, otherwise stacked. */
  columns: 1 | 3;
  /** Phone sizes: smaller type and padding. */
  compact?: boolean;
};

type CardSpec = Omit<MetricCardProps, "palette" | "compact" | "dense" | "descriptionChip">;

// Each card opens the list whose count it shows.
const buildCards = (summary: UserSummary, tab: UserTab, onSelectTab: (tab: UserTab) => void): CardSpec[] => [
  {
    tone: "primary",
    icon: "users",
    label: "Total accounts",
    value: summary.total,
    description: `${summary.staff} staff · ${summary.residents} residents`,
    onPress: () => onSelectTab("accounts"),
    accessibilityHint: "Shows every account",
    selected: tab === "accounts",
  },
  {
    tone: "care",
    icon: "user-check",
    label: "Active accounts",
    value: summary.active,
    description: activeShareNote(summary),
    onPress: () => onSelectTab("active"),
    accessibilityHint: "Shows active accounts",
    selected: tab === "active",
  },
  {
    tone: "danger",
    icon: "user-x",
    label: "Deactivated",
    value: summary.deactivated,
    description: "Can be reactivated",
    onPress: () => onSelectTab("deactivated"),
    accessibilityHint: "Shows deactivated accounts",
    selected: tab === "deactivated",
  },
];

const OverviewCards = ({ summary, tab, onSelectTab, columns, compact = false }: OverviewCardsProps) => {
  const palette = useAdminSurfacePalette();
  const gap = compact ? 12 : 16;

  if (!summary) {
    return (
      <MetricRow columns={columns} gap={gap}>
        {[0, 1, 2].map((index) => (
          <MetricCardSkeleton key={index} palette={palette} compact={compact} />
        ))}
      </MetricRow>
    );
  }

  return (
    <MetricRow columns={columns} gap={gap}>
      {buildCards(summary, tab, onSelectTab).map((card) => (
        <MetricCard key={card.label} palette={palette} compact={compact} descriptionChip {...card} />
      ))}
    </MetricRow>
  );
};

export default OverviewCards;
