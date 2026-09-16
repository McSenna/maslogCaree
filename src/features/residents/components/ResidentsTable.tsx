import { Text, View } from "react-native";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import type { ResidentRecord } from "../services/residentService";
import ResidentTableRow from "./ResidentTableRow";
import { RESIDENT_COLUMNS } from "./residentsLayout";

const HEADERS = [
  { label: "Resident", flex: RESIDENT_COLUMNS.resident },
  { label: "Contact", flex: RESIDENT_COLUMNS.contact },
  { label: "Address", flex: RESIDENT_COLUMNS.address },
  { label: "Status", flex: RESIDENT_COLUMNS.status },
  { label: "Date Registered", flex: RESIDENT_COLUMNS.registered },
];

type ResidentsTableProps = {
  residents: ResidentRecord[];
  selectedResidentId: string | null;
  onSelectResident: (resident: ResidentRecord) => void;
};

const ResidentsTable = ({
  residents,
  selectedResidentId,
  onSelectResident,
}: ResidentsTableProps) => {
  const palette = useUsersPalette();

  return (
    <View className="w-full">
      <View
        className="w-full flex-row items-center"
        style={{ height: 44, borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        {HEADERS.map((column) => (
          <View
            key={column.label}
            className="justify-center px-3"
            style={{ flex: column.flex, minWidth: 0 }}
          >
            <Text
              className="text-[12px] font-semibold"
              numberOfLines={1}
              style={{ color: palette.muted }}
            >
              {column.label}
            </Text>
          </View>
        ))}
      </View>

      {residents.map((resident, index) => (
        <ResidentTableRow
          key={resident._id}
          resident={resident}
          isSelected={selectedResidentId === resident._id}
          onSelect={() => onSelectResident(resident)}
          isLast={index === residents.length - 1}
        />
      ))}
    </View>
  );
};

export default ResidentsTable;
