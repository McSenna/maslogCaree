import { Badge, TableButton, TableText, type Column } from "@/components/data-table";

import { STATUS_BADGES } from "./vaccinationBadges";
import type { VaccinationEntry } from "./vaccinationTypes";

// Vaccine names and dates wrap: a shortened value could be misread as another dose.
const wrapped = (value: string) => <TableText value={value} lines={3} />;

export const vaccinationColumns = (onViewDetails: (entryId: string) => void): Column<VaccinationEntry>[] => [
  { key: "vaccine", header: "Vaccine", nameColumn: true, flex: 1.1, minWidth: 140, cardRole: "title", accessor: (entry) => entry.vaccineName, render: (entry) => <TableText value={entry.vaccineName} weight="strong" lines={3} /> },
  { key: "dose", header: "Dose", width: 120, cardRole: "field", accessor: (entry) => entry.doseLabel, render: (entry) => wrapped(entry.doseLabel) },
  { key: "date", header: "Date administered", width: 172, cardRole: "field", accessor: (entry) => entry.dateLabel, render: (entry) => wrapped(entry.dateLabel) },
  { key: "next", header: "Next scheduled dose", flex: 1, minWidth: 190, cardRole: "field", accessor: (entry) => entry.nextDose, render: (entry) => wrapped(entry.nextDose) },
  {
    key: "status",
    header: "Status",
    width: 168,
    cardRole: "badge",
    accessor: (entry) => STATUS_BADGES[entry.status].label,
    render: (entry) => <Badge spokenAs="Status" {...STATUS_BADGES[entry.status]} />,
  },
  {
    key: "action",
    header: "Action",
    width: 176,
    cardRole: "actions",
    render: (entry) => (
      <TableButton
        label="View Details"
        icon="arrow-right"
        size="comfortable"
        accessibilityLabel={`View details for ${entry.vaccineName}, ${entry.doseLabel}`}
        onPress={() => onViewDetails(entry.id)}
      />
    ),
  },
];
