import { Text, View } from "react-native";
import { useUsersPalette } from "../../usersTheme";
import { REQUEST_COLUMNS } from "../userRequestsColumns";

const HEADERS: { label: string; flex?: number; width?: number }[] = [
  { label: "Resident", flex: REQUEST_COLUMNS.resident },
  { label: "Contact", flex: REQUEST_COLUMNS.contact },
  { label: "ID Type", flex: REQUEST_COLUMNS.idType },
  { label: "Registered", flex: REQUEST_COLUMNS.registered },
  { label: "Status", flex: REQUEST_COLUMNS.status },
];

const RequestsTableHeader = () => {
  const palette = useUsersPalette();

  return (
    <View
      className="w-full flex-row items-center"
      style={{ height: 44, borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      {HEADERS.map((column) => (
        <View key={column.label} className="justify-center px-3" style={{ flex: column.flex, minWidth: 0 }}>
          <Text className="text-[12px] font-semibold" numberOfLines={1} style={{ color: palette.muted }}>
            {column.label}
          </Text>
        </View>
      ))}
      <View className="items-end justify-center px-3" style={{ width: REQUEST_COLUMNS.action }}>
        <Text className="text-[12px] font-semibold" style={{ color: palette.muted }}>
          Action
        </Text>
      </View>
    </View>
  );
};

export default RequestsTableHeader;
