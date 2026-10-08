import { TableButton, TablePrimaryCell, TableText, TableTwoLine, type Column } from "@/components/data-table";

import { formatVisitDate } from "../masterlistLabels";
import type { MasterlistRow } from "../types";
import { LinkagePill, SourcePill } from "./MasterlistPills";
import { providerOf, residentLineOf, residentNameOf, serviceLineOf } from "./rowText";

/** Medical records, declared once for the header, rows, skeleton and phone cards. */
export const masterlistColumns = (onView: (id: string) => void): Column<MasterlistRow>[] => [
  {
    key: "resident",
    header: "Resident",
    flex: 1.4,
    minWidth: 200,
    render: (row) => <TablePrimaryCell title={residentNameOf(row)} detail={residentLineOf(row)} />,
  },
  { key: "visit", header: "Visit date", width: 120, accessor: (row) => formatVisitDate(row.source, row.visitDate) },
  {
    key: "service",
    header: "Service",
    flex: 1,
    minWidth: 160,
    // Provider and source fold under the service when their own columns are hidden.
    render: (row, _index, { hiddenKeys }) =>
      hiddenKeys.has("provider") ? (
        <TableTwoLine value={row.serviceLabel} detail={serviceLineOf(row)} />
      ) : (
        <TableText value={row.serviceLabel} weight="strong" />
      ),
  },
  { key: "provider", header: "Provider", flex: 1, minWidth: 160, hideBelow: "lg", accessor: providerOf },
  {
    key: "source",
    header: "Source",
    width: 170,
    hideBelow: "lg",
    cardRole: "badge",
    render: (row) => <SourcePill source={row.source} />,
  },
  { key: "linkage", header: "Account", width: 150, cardRole: "badge", render: (row) => <LinkagePill linkage={row.linkage} /> },
  {
    key: "actions",
    header: "Actions",
    width: 112,
    render: (row) => (
      <TableButton
        icon="file-text"
        label="View"
        accessibilityLabel={`View the ${row.serviceLabel} record for ${residentNameOf(row)}, ${formatVisitDate(row.source, row.visitDate)}`}
        onPress={() => onView(row._id)}
      />
    ),
  },
];

