import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { CompletionPlaceholder, ErrorBanner } from "@/components/medicalRecord/complete/CompletionChrome";
import SearchField from "@/components/ui/SearchField";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";
import { masterFullName } from "@/features/masterList/masterResidentForm";
import IdentityOption from "@/features/medicalRecordMasterlist/components/editor/IdentityOption";

import { useMasterRecordSearch } from "./useMasterRecordSearch";

type Props = { picked: MasterResidentRecord | null; onPick: (record: MasterResidentRecord) => void };

const asIdentity = (record: MasterResidentRecord) => ({
  masterResidentId: record.masterResidentId,
  fullName: masterFullName(record),
  dateOfBirth: record.dateOfBirth,
  sex: record.sex,
  purok: record.address,
  hasAccount: record.linkedAccount,
});

/** Search active master list records that no other account holds. */
const MasterRecordPicker = ({ picked, onPick }: Props) => {
  const palette = useQueuePalette();
  const search = useMasterRecordSearch();
  const note = { color: palette.muted };

  const results = () => {
    if (search.tooShort) return <Text className="text-[12.5px]" style={note}>Type at least two letters of the name or the record ID.</Text>;
    if (search.error) return <ErrorBanner message={search.error} />;
    if (search.loading && search.records.length === 0) return <CompletionPlaceholder message="Searching the master list." />;
    if (search.records.length === 0) return <Text className="text-[12.5px]" style={note}>No active record without an account matches.</Text>;
    return (
      <View accessibilityRole="radiogroup" className="gap-2">
        {search.records.map((record) => (
          <IdentityOption
            key={record._id}
            identity={asIdentity(record)}
            selected={picked?._id === record._id}
            onSelect={() => onPick(record)}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="gap-2.5">
      <SearchField value={search.query} onChangeText={search.setQuery} placeholder="Name or master list ID" accessibilityLabel="Search the master list" />
      {results()}
    </View>
  );
};

export default MasterRecordPicker;
