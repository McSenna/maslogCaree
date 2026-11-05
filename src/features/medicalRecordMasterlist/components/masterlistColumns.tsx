import { immunizationProgressLabel } from "@/services/immunizationRecordProgress";
import { TablePrimaryCell, TableText, TableTwoLine, type Column } from "@/components/data-table";

import { formatVisitDate } from "../masterlistLabels";
import type { MasterlistRow } from "../types";
import MedicalRecordActions, { type MedicalRecordActionHandlers } from "./MedicalRecordActions";
import { LinkagePill, SourcePill } from "./MasterlistPills";
import { providerOf, residentLineOf, residentNameOf, serviceLineOf } from "./rowText";

/** Medical records, declared once for the header, rows, skeleton and phone cards. */
export const masterlistColumns = (actions: MedicalRecordActionHandlers): Column<MasterlistRow>[] => [
  {
    key: "resident", nameColumn: true,
    header: "Resident",
    flex: 1.4,
    minWidth: 200,
    render: (row) => <TablePrimaryCell title={residentNameOf(row)} detail={residentLineOf(row)} />,
  },
  { key: "visit", header: "Visit date", align: "center", width: 134, accessor: (row) => formatVisitDate(row.source, row.visitDate) },
  {
    key: "service",
    header: "Service",
    flex: 1,
    minWidth: 160,
    // Provider and source fold under the service when their own columns are hidden.
    render: (row, _index, { hiddenKeys }) =>
      row.recordStatus ? (
        <TableTwoLine value={row.serviceLabel} detail={immunizationProgressLabel(row) || ""} />
      ) : hiddenKeys.has("provider") ? (
        <TableTwoLine value={row.serviceLabel} detail={serviceLineOf(row)} />
      ) : (
        <TableText value={row.serviceLabel} weight="strong" />
      ),
  },
  { key: "provider", header: "Provider", flex: 1, minWidth: 160, hideBelow: "lg", accessor: providerOf },
  {
    key: "source",
    header: "Source",
    align: "center",
    width: 192,
    hideBelow: "lg",
    cardRole: "badge",
    render: (row) => <SourcePill source={row.source} />,
  },
  { key: "linkage", header: "Account", align: "center", width: 168, cardRole: "badge", render: (row) => <LinkagePill linkage={row.linkage} /> },
  {
    key: "actions",
    header: "Actions",
    width: 216,
    align: "center",
    render: (row) => <MedicalRecordActions row={row} {...actions} />,
  },
];
