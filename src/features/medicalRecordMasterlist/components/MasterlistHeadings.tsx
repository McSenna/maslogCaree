import { View } from "react-native";

import { HeadingCell as Cell, TableHeadings } from "@/components/dashboard/kit/TableHeadings";

import { MASTERLIST_COLUMN, type MasterlistTableMode } from "./masterlistColumns";

/** The dashboard table's tinted heading band, for medical records. */
const MasterlistHeadings = ({ mode }: { mode: MasterlistTableMode }) => (
  <TableHeadings>
    <Cell label="Resident" className={MASTERLIST_COLUMN.resident} />
    <Cell label="Visit date" className={MASTERLIST_COLUMN.visit} />
    <Cell label="Service" className={MASTERLIST_COLUMN.service} />
    {mode === "full" ? <Cell label="Provider" className={MASTERLIST_COLUMN.provider} /> : null}
    {mode === "full" ? <Cell label="Source" className={MASTERLIST_COLUMN.source} /> : null}
    <Cell label="Account" className={MASTERLIST_COLUMN.linkage} />
    <View className={MASTERLIST_COLUMN.actions} />
  </TableHeadings>
);

export default MasterlistHeadings;
