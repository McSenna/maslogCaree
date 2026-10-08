import { TablePrimaryCell, TableText, type CellContext, type Column } from "@/components/data-table";

import type { MasterResidentRecord } from "../masterList.types";
import { capitalize, formatBirthDate, masterFullName } from "../masterResidentForm";
import MasterRecordActions from "./MasterRecordActions";
import { AccountLinkPill, RecordStatusPill } from "./MasterRecordPills";

type Handlers = {
  onEdit: (record: MasterResidentRecord) => void;
  onToggleActive: (record: MasterResidentRecord) => void;
};

const folded = (record: MasterResidentRecord, { hiddenKeys }: CellContext) =>
  [
    record.masterResidentId,
    hiddenKeys.has("birthDate") ? `Born ${formatBirthDate(record.dateOfBirth)}` : "",
    hiddenKeys.has("sex") ? capitalize(record.sex) : "",
    hiddenKeys.has("civilStatus") ? capitalize(record.civilStatus) : "",
    hiddenKeys.has("address") ? record.address : "",
  ]
    .filter(Boolean)
    .join(" · ");

/** The Resident Records table, declared once for its header, rows, skeleton and phone cards. */
const masterListColumns = ({ onEdit, onToggleActive }: Handlers): Column<MasterResidentRecord>[] => [
  {
    key: "record",
    header: "Resident record",
    flex: 2.2,
    // 200, not 240: with it the essential columns fit beside the sidebar at a 1024px window.
    minWidth: 200,
    render: (record, _index, context) => (
      <TablePrimaryCell title={masterFullName(record)} detail={folded(record, context)} />
    ),
  },
  {
    key: "birthDate",
    header: "Birth date",
    width: 120,
    hideBelow: "md",
    render: (record) => <TableText value={formatBirthDate(record.dateOfBirth)} />,
  },
  { key: "sex", header: "Sex", width: 90, hideBelow: "lg", accessor: (record) => capitalize(record.sex) },
  {
    key: "civilStatus",
    header: "Civil status",
    width: 110,
    hideBelow: "lg",
    accessor: (record) => capitalize(record.civilStatus),
  },
  {
    key: "address",
    header: "Purok and street",
    flex: 1.8,
    minWidth: 150,
    hideBelow: "md",
    accessor: (record) => record.address,
  },
  {
    key: "appAccount",
    header: "App account",
    width: 148,
    cardRole: "badge",
    render: (record) => <AccountLinkPill linked={record.linkedAccount} />,
  },
  {
    key: "status",
    header: "Status",
    width: 120,
    cardRole: "badge",
    render: (record) => <RecordStatusPill active={record.isActive} />,
  },
  {
    key: "actions",
    header: "Actions",
    width: 200,
    render: (record) => <MasterRecordActions record={record} onEdit={onEdit} onToggleActive={onToggleActive} />,
  },
];


export default masterListColumns;