import { Text, View } from "react-native";
import type { QueuePalette } from "../queueTheme";
import { COLUMNS } from "./columns";
import TableCell from "./TableCell";

const AppointmentsTableHeader = ({
  palette,
  hasAction,
}: {
  palette: QueuePalette;
  hasAction: boolean;
}) => {
  const label = (text: string) => (
    <Text
      className="text-[12px] font-semibold uppercase"
      style={{ color: palette.subtle, letterSpacing: 0.4 }}
    >
      {text}
    </Text>
  );

  return (
    <View
      className="w-full flex-row items-center py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <TableCell width={COLUMNS.index}>{label("#")}</TableCell>
      <TableCell flex={COLUMNS.patient}>{label("Patient Name")}</TableCell>
      <TableCell flex={COLUMNS.service}>{label("Service")}</TableCell>
      <TableCell flex={COLUMNS.date}>{label("Date")}</TableCell>
      <TableCell flex={COLUMNS.time}>{label("Time")}</TableCell>
      <TableCell flex={COLUMNS.status}>{label("Status")}</TableCell>
      {hasAction ? <TableCell width={COLUMNS.action}>{label("Action")}</TableCell> : null}
    </View>
  );
};

export default AppointmentsTableHeader;
