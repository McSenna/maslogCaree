import MetricCard from "@/components/dashboard/admin/MetricCard";
import MetricCardSkeleton from "@/components/dashboard/admin/MetricCardSkeleton";
import { MetricRow } from "@/components/dashboard/kit/DashboardLayout";
import type { MetricCardProps } from "@/components/dashboard/admin/MetricCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UserSummary, UserTab } from "../../userAdmin.types";
import { activeShareNote } from "../../userAdminModel";
import { monthStartNote } from "../../userDates";

type OverviewCardsProps = {
  summary: UserSummary | null;
  tab: UserTab;
  onSelectTab: (tab: UserTab) => void;
  /** Four in a row when there is room, otherwise two by two (as on the dashboard). */
  columns: 2 | 4;
  /** Phone sizes: smaller type and padding. */
  compact?: boolean;
  dense?: boolean;
};

type CardSpec = Omit<MetricCardProps, "palette" | "compact" | "dense">;

// Same tones and icons as the dashboard's account cards, so the numbers read as the same family.
const buildCards = (summary: UserSummary, tab: UserTab, onSelectTab: (tab: UserTab) => void): CardSpec[] => [
  {
    tone: "blue",
    icon: "users",
    label: "Total users",
    value: summary.total,
    description: `${summary.staff} staff, ${summary.residents} residents`,
    onPress: () => onSelectTab("masterlist"),
    accessibilityHint: "Shows every account",
    selected: tab === "masterlist",
  },
  {
    tone: "green",
    icon: "user-check",
    label: "Active",
    value: summary.active,
    description: activeShareNote(summary),
    onPress: () => onSelectTab("active"),
    accessibilityHint: "Shows active users",
    selected: tab === "active",
  },
  { tone: "purple", icon: "user-plus", label: "Added this month", value: summary.addedThisMonth, description: monthStartNote() },
  {
    tone: "pink",
    icon: "user-x",
    label: "Deactivated",
    value: summary.deactivated,
    description: "Accounts can be reactivated",
    onPress: () => onSelectTab("deactivated"),
    accessibilityHint: "Shows deactivated accounts",
    selected: tab === "deactivated",
  },
];

const OverviewCards = ({ summary, tab, onSelectTab, columns, compact = false, dense = false }: OverviewCardsProps) => {
  const palette = useAdminSurfacePalette();
  const gap = compact ? 12 : 16;

  if (!summary) {
    return (
      <MetricRow columns={columns} gap={gap}>
        {[0, 1, 2, 3].map((index) => (
          <MetricCardSkeleton key={index} palette={palette} compact={compact} />
        ))}
      </MetricRow>
    );
  }

  return (
    <MetricRow columns={columns} gap={gap}>
      {buildCards(summary, tab, onSelectTab).map((card) => (
        <MetricCard key={card.label} palette={palette} compact={compact} dense={dense} {...card} />
      ))}
    </MetricRow>
  );
};

export default OverviewCards;
