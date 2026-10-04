import MetricCard, { type MetricCardProps } from "@/components/dashboard/admin/MetricCard";
import MetricCardSkeleton from "@/components/dashboard/admin/MetricCardSkeleton";
import { MetricRow } from "@/components/dashboard/kit/DashboardLayout";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterlistCardKey } from "../masterlistLabels";
import type { MasterlistSummary } from "../types";

type Props = {
  summary: MasterlistSummary | null;
  selected: MasterlistCardKey | null;
  onSelect: (key: MasterlistCardKey) => void;
  columns: 2 | 4;
  compact?: boolean;
  dense?: boolean;
};

type CardSpec = Omit<MetricCardProps, "palette" | "compact" | "dense"> & { key: MasterlistCardKey };

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

// Each card opens the list its number counts, so the two always agree.
const buildCards = (summary: MasterlistSummary): CardSpec[] => [
  {
    key: "total",
    tone: "primary",
    icon: "file-text",
    label: "Medical records",
    value: summary.total,
    description: `${plural(summary.historical, "historical record")} from paper`,
    accessibilityHint: "Shows every record",
  },
  {
    key: "linked",
    tone: "care",
    icon: "link",
    label: "Linked to an account",
    value: summary.linked,
    description: "Residents see these in the app",
    accessibilityHint: "Shows records linked to an account",
  },
  {
    key: "unlinked",
    tone: "neutral",
    icon: "minus-circle",
    label: "No account yet",
    value: summary.unlinked,
    description: "Shown once an account is linked",
    accessibilityHint: "Shows records with no account",
  },
  {
    key: "pending_review",
    tone: "accent",
    icon: "help-circle",
    label: "Needs review",
    value: summary.pendingReview,
    description: "A sign-up may be this person",
    accessibilityHint: "Shows records waiting on a User Request",
  },
];

const MasterlistCards = ({ summary, selected, onSelect, columns, compact = false, dense = false }: Props) => {
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
      {buildCards(summary).map(({ key, ...card }) => (
        <MetricCard
          key={key}
          palette={palette}
          compact={compact}
          dense={dense}
          {...card}
          onPress={() => onSelect(key)}
          selected={selected === key}
        />
      ))}
    </MetricRow>
  );
};

export default MasterlistCards;
