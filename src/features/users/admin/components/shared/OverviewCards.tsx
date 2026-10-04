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
  /** "Added this month": all accounts, newest first. */
  onShowNewest: () => void;
  /** True while that newest-first view is what the list shows. */
  newestSelected: boolean;
  /** Four in a row when there is room, otherwise two by two (as on the dashboard). */
  columns: 2 | 4;
  /** Phone sizes: smaller type and padding. */
  compact?: boolean;
  dense?: boolean;
};

type CardSpec = Omit<MetricCardProps, "palette" | "compact" | "dense">;

// Same tones and icons as the dashboard's account cards, so the numbers read as the same family.
const buildCards = (
  summary: UserSummary,
  tab: UserTab,
  onSelectTab: (tab: UserTab) => void,
  onShowNewest: () => void,
  newestSelected: boolean
): CardSpec[] => [
  {
    tone: "primary",
    icon: "users",
    label: "Total users",
    value: summary.total,
    description: `${summary.staff} staff, ${summary.residents} residents`,
    onPress: () => onSelectTab("accounts"),
    accessibilityHint: "Shows every account",
    selected: tab === "accounts" && !newestSelected,
  },
  {
    tone: "care",
    icon: "user-check",
    label: "Active",
    value: summary.active,
    description: activeShareNote(summary),
    onPress: () => onSelectTab("active"),
    accessibilityHint: "Shows active users",
    selected: tab === "active",
  },
  {
    tone: "accent",
    icon: "user-plus",
    label: "Added this month",
    value: summary.addedThisMonth,
    description: monthStartNote(),
    onPress: onShowNewest,
    accessibilityHint: "Shows every account, newest first",
    selected: newestSelected,
  },
  {
    tone: "neutral",
    icon: "user-x",
    label: "Deactivated",
    value: summary.deactivated,
    description: "Accounts can be reactivated",
    onPress: () => onSelectTab("deactivated"),
    accessibilityHint: "Shows deactivated accounts",
    selected: tab === "deactivated",
  },
];

const OverviewCards = ({
  summary,
  tab,
  onSelectTab,
  onShowNewest,
  newestSelected,
  columns,
  compact = false,
  dense = false,
}: OverviewCardsProps) => {
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
      {buildCards(summary, tab, onSelectTab, onShowNewest, newestSelected).map((card) => (
        <MetricCard key={card.label} palette={palette} compact={compact} dense={dense} {...card} />
      ))}
    </MetricRow>
  );
};

export default OverviewCards;
