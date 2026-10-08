import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TableLink, TablePrimaryCell, TableText, TableTwoLine, type Column } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AppointmentRecord } from "@/services/appointments";
import { appointmentPatientName, childCaption } from "@/utils/appointmentPatient";

import type { QueuePalette } from "../queueTheme";
import { isRescheduledRequest, scheduleFor } from "./appointmentSchedule";
import QueueAvatar from "./QueueAvatar";
import RowActions, { type RowActionProps } from "./RowActions";

type Options = Omit<RowActionProps, "appointment"> & {
  palette: QueuePalette;
  serviceLabelOf: (appointment: AppointmentRecord) => string;
};

/** The only cue that a row opens the record when staff cannot act on it; the row itself is the control. */
const ViewRecordHint = ({ palette }: { palette: QueuePalette }) => (
  <View className="flex-row items-center gap-1.5">
    <Feather name="file-text" size={14} color={palette.primary} />
    <Text style={[TABLE_TEXT.button, { color: palette.primary }]}>View record</Text>
  </View>
);

const PatientLink = ({
  appointment,
  onOpen,
  palette,
}: {
  appointment: AppointmentRecord;
  onOpen: (appointment: AppointmentRecord) => void;
  palette: QueuePalette;
}) => {
  const name = appointmentPatientName(appointment);
  const caption = childCaption(appointment);
  return (
    <View className="min-w-0 gap-0.5">
      <TableLink label={name} accessibilityLabel={`View the medical record for ${name}`} onPress={() => onOpen(appointment)} />
      {caption ? (
        <Text numberOfLines={1} style={[TABLE_TEXT.secondary, { color: palette.muted }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
};

/** Appointments in the queue panel, declared once for the header, rows and skeleton. */
export const appointmentColumns = ({ palette, serviceLabelOf, ...actions }: Options): Column<AppointmentRecord>[] => [
  {
    key: "position",
    header: "#",
    width: 64,
    render: (_appointment, index) => <TableText value={String(index + 1).padStart(3, "0")} tone="muted" weight="strong" />,
  },
  {
    key: "patient",
    header: "Patient name",
    flex: 2.4,
    minWidth: 220,
    render: (appointment) => (
      <View className="min-w-0 flex-row items-center gap-3 self-stretch">
        <QueueAvatar name={appointmentPatientName(appointment, "")} palette={palette} />
        <View className="min-w-0 flex-1">
          {actions.canAct && actions.onRowPress ? (
            // Rows with buttons open by pointer; the name is the same action for keyboards and screen readers.
            <PatientLink appointment={appointment} onOpen={actions.onRowPress} palette={palette} />
          ) : (
            <TablePrimaryCell title={appointmentPatientName(appointment)} detail={childCaption(appointment) || undefined} />
          )}
        </View>
      </View>
    ),
  },
  {
    key: "service",
    header: "Service",
    flex: 1.6,
    minWidth: 150,
    render: (appointment) => (
      <TableTwoLine value={serviceLabelOf(appointment)} detail={isRescheduledRequest(appointment) ? "Rescheduled" : undefined} />
    ),
  },
  { key: "date", header: "Date", width: 130, accessor: (appointment) => scheduleFor(appointment).date },
  { key: "time", header: "Time", width: 110, accessor: (appointment) => scheduleFor(appointment).time },
  { key: "status", header: "Status", width: 150, render: (appointment) => <AppointmentStatusBadge status={appointment.status} /> },
  ...(actions.canAct || actions.onRowPress
    ? [
        {
          key: "actions",
          header: "Actions",
          width: 180,
          render: (appointment: AppointmentRecord) =>
            actions.canAct ? <RowActions appointment={appointment} {...actions} /> : <ViewRecordHint palette={palette} />,
        },
      ]
    : []),
];
