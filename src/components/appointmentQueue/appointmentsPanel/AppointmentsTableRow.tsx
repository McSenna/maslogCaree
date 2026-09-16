import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { QueuePalette } from "../queueTheme";
import StatusBadge from "../StatusBadge";
import { scheduleFor } from "./appointmentSchedule";
import { COLUMNS } from "./columns";
import QueueAvatar from "./QueueAvatar";
import RowActions, { type RowActionProps } from "./RowActions";
import TableCell from "./TableCell";

type AppointmentsTableRowProps = RowActionProps & {
  index: number;
  serviceLabel: string;
  isLast: boolean;
  palette: QueuePalette;
};

const AppointmentsTableRow = ({
  appointment,
  index,
  serviceLabel,
  isLast,
  palette,
  ...actions
}: AppointmentsTableRowProps) => {
  const [hovered, setHovered] = useState(false);
  const when = scheduleFor(appointment);
  const open = actions.onRowPress;

  const Row = open ? Pressable : View;

  return (
    <Row
      {...(open
        ? {
            onPress: () => open(appointment),
            accessibilityRole: "button" as const,
            accessibilityLabel: `View the medical record for ${appointment.resident?.fullname ?? "this appointment"}`,
          }
        : {})}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="w-full flex-row items-center"
      style={{
        minHeight: 64,
        backgroundColor: hovered ? palette.rowHover : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <TableCell width={COLUMNS.index}>
        <Text className="text-[13px] font-semibold" style={{ color: palette.subtle }}>
          {String(index).padStart(3, "0")}
        </Text>
      </TableCell>

      <TableCell flex={COLUMNS.patient}>
        <View className="flex-row items-center gap-2.5">
          <QueueAvatar name={appointment.resident?.fullname ?? ""} palette={palette} />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-[14px] font-semibold"
            style={{ color: palette.heading }}
          >
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
        </View>
      </TableCell>

      <TableCell flex={COLUMNS.service}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {serviceLabel}
        </Text>
      </TableCell>

      <TableCell flex={COLUMNS.date}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {when.date}
        </Text>
      </TableCell>

      <TableCell flex={COLUMNS.time}>
        <Text numberOfLines={1} className="text-[13.5px]" style={{ color: palette.body }}>
          {when.time}
        </Text>
      </TableCell>

      <TableCell flex={COLUMNS.status}>
        <StatusBadge status={appointment.status} />
      </TableCell>

      {actions.canAct ? (
        <TableCell width={COLUMNS.action}>
          <RowActions appointment={appointment} {...actions} />
        </TableCell>
      ) : open ? (
        <TableCell width={COLUMNS.action}>
          <View className="flex-row items-center gap-1.5">
            <Feather name="file-text" size={14} color={palette.primary} />
            <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
              View record
            </Text>
          </View>
        </TableCell>
      ) : null}
    </Row>
  );
};

export default AppointmentsTableRow;
