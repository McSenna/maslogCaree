import { View } from "react-native";

import { TableButton } from "@/components/data-table";

import type { MasterResidentRecord } from "../masterList.types";
import { masterFullName } from "../masterResidentForm";

type Props = {
  record: MasterResidentRecord;
  onEdit: (record: MasterResidentRecord) => void;
  onDelete: (record: MasterResidentRecord) => void;
  busy?: boolean;
  deletingId?: string;
  onToggleActive: (record: MasterResidentRecord) => void;
};

const MasterRecordActions = ({ record, onEdit, onDelete, onToggleActive, busy = false, deletingId }: Props) => {
  const name = masterFullName(record);
  const toggle = record.isActive ? "Deactivate" : "Reactivate";

  return (
    <View role="group" accessibilityLabel="Resident record actions" className="flex-row items-center gap-2">
      <TableButton iconOnly size="comfortable" disabled={busy} icon="edit-2" label="Edit" accessibilityLabel={`Edit ${name}`} onPress={() => onEdit(record)} />
      <TableButton
        iconOnly size="comfortable" icon="trash-2" label="Delete" tone="danger"
        disabled={busy} loading={deletingId === record._id}
        accessibilityLabel={`Delete ${name}`}
        accessibilityHint="Asks you to confirm first"
        onPress={() => onDelete(record)}
      />
      <TableButton
        iconOnly size="comfortable" disabled={busy}
        icon={record.isActive ? "power" : "refresh-cw"}
        variant="outlined"
        tone={record.isActive ? "danger" : "default"}
        label={toggle}
        accessibilityLabel={`${toggle} ${name}`}
        accessibilityHint="Asks you to confirm first"
        onPress={() => onToggleActive(record)}
      />
    </View>
  );
};

export default MasterRecordActions;
