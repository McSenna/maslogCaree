import { View } from "react-native";

import { TableButton } from "@/components/data-table";

import type { MasterResidentRecord } from "../masterList.types";
import { masterFullName } from "../masterResidentForm";
import { residentTriggerId } from "../residentDetails/returnFocus";

type Props = {
  record: MasterResidentRecord;
  onEdit: (record: MasterResidentRecord) => void;
  onDelete: (record: MasterResidentRecord) => void;
  onView: (record: MasterResidentRecord) => void;
  busy?: boolean;
  deletingId?: string;
};

const MasterRecordActions = ({ record, onEdit, onDelete, onView, busy = false, deletingId }: Props) => {
  const name = masterFullName(record);

  return (
    <View role="group" accessibilityLabel="Resident record actions" className="flex-row items-center gap-2">
      <TableButton
        iconOnly size="comfortable" icon="eye" label="View"
        nativeID={residentTriggerId(record._id)}
        accessibilityLabel={`View ${name}`}
        onPress={() => onView(record)}
      />
      <TableButton iconOnly size="comfortable" disabled={busy} icon="edit-2" label="Edit" accessibilityLabel={`Edit ${name}`} onPress={() => onEdit(record)} />
      <TableButton
        iconOnly size="comfortable" icon="trash-2" label="Delete" tone="danger"
        disabled={busy} loading={deletingId === record._id}
        accessibilityLabel={`Delete ${name}`}
        accessibilityHint="Asks you to confirm first"
        onPress={() => onDelete(record)}
      />
    </View>
  );
};

export default MasterRecordActions;
