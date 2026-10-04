import { View } from "react-native";

import { HeadingCell as Cell, TableHeadings as Band } from "@/components/dashboard/kit/TableHeadings";
import Checkbox from "@/components/ui/Checkbox";

import type { RowSelection } from "../../hooks/useRowSelection";
import { COLUMN, type TableMode } from "./tableColumns";

export const UserHeadings = ({ mode, selection }: { mode: TableMode; selection: RowSelection }) => (
  <Band>
    <View className={COLUMN.check}>
      <Checkbox
        checked={selection.allSelected}
        indeterminate={selection.count > 0 && !selection.allSelected}
        onChange={selection.toggleAll}
        accessibilityLabel="Select all users"
      />
    </View>
    <Cell label="User" className={COLUMN.user} />
    <Cell label="Role" className={COLUMN.role} />
    {mode === "full" ? <Cell label="Access" className={COLUMN.access} /> : null}
    {mode === "tablet" ? null : <Cell label="Location" className={COLUMN.location} />}
    <Cell label="Status" className={COLUMN.status} />
    <Cell label="Last login" className={COLUMN.lastLogin} />
    <View className={COLUMN.actions} />
  </Band>
);

export const RequestHeadings = ({ mode, pending }: { mode: TableMode; pending: boolean }) => (
  <Band>
    <Cell label="User" className={COLUMN.user} />
    <Cell label="Role requested" className={COLUMN.requested} />
    {mode === "tablet" ? null : <Cell label="Location" className={COLUMN.location} />}
    <Cell label="Submitted" className={COLUMN.submitted} />
    <View className={pending ? COLUMN.decide : COLUMN.review} />
  </Band>
);
