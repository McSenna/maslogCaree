import { View } from "react-native";

import { TableButton } from "@/components/data-table";

import type { MasterResidentRecord } from "../masterList.types";
import { masterFullName } from "../masterResidentForm";

type Props = {
  record: MasterResidentRecord;
  onEdit: (record: MasterResidentRecord) => void;
  /** Opens the confirmation; nothing changes until it is accepted. */
  onToggleActive: (record: MasterResidentRecord) => void;
};

/** Edit, then Deactivate or Reactivate, 20px apart and starting at the column's left edge. */
const MasterRecordActions = ({ record, onEdit, onToggleActive }: Props) => {
  const name = masterFullName(record);
  const toggle = record.isActive ? "Deactivate" : "Reactivate";

  return (
    <View className="flex-row items-center gap-5">
      <TableButton icon="edit-2" label="Edit" accessibilityLabel={`Edit ${name}`} onPress={() => onEdit(record)} />
      <TableButton
        variant="text"
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
