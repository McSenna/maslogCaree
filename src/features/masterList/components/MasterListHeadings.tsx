import { View } from "react-native";

import { HeadingCell as Cell, TableHeadings } from "@/components/dashboard/kit/TableHeadings";

import { MASTER_COLUMN, type MasterTableMode } from "./masterColumns";

/** The dashboard table's tinted heading band, for master list records. */
const MasterListHeadings = ({ mode }: { mode: MasterTableMode }) => (
  <TableHeadings>
    <Cell label="Resident record" className={MASTER_COLUMN.resident} />
    {mode === "tablet" ? null : <Cell label="Birth date" className={MASTER_COLUMN.birth} />}
    {mode === "tablet" ? null : <Cell label="Sex" className={MASTER_COLUMN.sex} />}
    {mode === "tablet" ? null : <Cell label="Civil status" className={MASTER_COLUMN.civil} />}
    {mode === "full" ? <Cell label="Purok and street" className={MASTER_COLUMN.address} /> : null}
    <Cell label="App account" className={MASTER_COLUMN.account} />
    <Cell label="Status" className={MASTER_COLUMN.status} />
    <View className={MASTER_COLUMN.actions} />
  </TableHeadings>
);

export default MasterListHeadings;
