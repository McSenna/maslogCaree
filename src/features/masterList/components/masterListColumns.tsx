import type { ComponentProps } from "react";

import { TablePrimaryCell, TableText, type CellContext, type Column } from "@/components/data-table";
import { civilStatusLabel } from "@/config/civilStatus";

import type { MasterResidentRecord } from "../masterList.types";
import { capitalize, formatBirthDate, masterFullName } from "../masterResidentForm";
import MasterRecordActions from "./MasterRecordActions";
import { ResidentRolePill } from "./MasterRecordPills";

type Handlers = Omit<ComponentProps<typeof MasterRecordActions>, "record">;

const folded = (record: MasterResidentRecord, { hiddenKeys }: CellContext) =>
  [
    hiddenKeys.has("birthDate") ? `Born ${formatBirthDate(record.dateOfBirth)}` : "",
    hiddenKeys.has("sex") ? capitalize(record.sex) : "",
    hiddenKeys.has("civilStatus") ? civilStatusLabel(record.civilStatus) : "",
    hiddenKeys.has("address") ? record.address : "",
  ]
    .filter(Boolean)
    .join(" · ");

/** The Resident Records table, declared once for its header, rows, skeleton and phone cards. */
const masterListColumns = (handlers: Handlers): Column<MasterResidentRecord>[] => [
  {
    key: "record", nameColumn: true,
    header: "Resident record",
    align: "left",
    flex: 2.2,
    minWidth: 180,
    render: (record, _index, context) => (
      <TablePrimaryCell title={masterFullName(record)} detail={folded(record, context)} />
    ),
  },
  {
    key: "role",
    header: "Role",
    align: "center",
    width: 130,
    cardRole: "badge",
    render: (record) => <ResidentRolePill role={record.role} />,
  },
  {
    key: "birthDate",
    header: "Birth date",
    align: "center",
    width: 124,
    hideBelow: "md",
    render: (record) => <TableText value={formatBirthDate(record.dateOfBirth)} />,
  },
  { key: "sex", header: "Sex", align: "center", width: 90, hideBelow: "lg", accessor: (record) => capitalize(record.sex) },
  {
    key: "civilStatus",
    header: "Civil status",
    align: "center",
    // Fits "Single - Solo Parent" in full.
    width: 176,
    hideBelow: "lg",
    accessor: (record) => civilStatusLabel(record.civilStatus) || "Not set",
  },
  {
    key: "address",
    header: "Purok and street",
    align: "left",
    flex: 1.8,
    minWidth: 150,
    hideBelow: "md",
    accessor: (record) => record.address,
  },
  {
    key: "actions",
    header: "Actions",
    align: "center",
    width: 184,
    cardRole: "actions",
    render: (record) => <MasterRecordActions record={record} {...handlers} />,
  },
];


export default masterListColumns;
