import { Text, View } from "react-native";
import { residentStatusLabel } from "@/features/appointments/appointmentPresenter";
import { STATUS_TONE } from "@/features/resident/records/recordPresentation";

type AppointmentStatusPillProps = {
  status: string;
};

const AppointmentStatusPill = ({ status }: AppointmentStatusPillProps) => {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.default;
  const label = residentStatusLabel(status);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      className={`self-start rounded-full px-2.5 py-1 ${tone.bg}`}
    >
      <Text className={`text-xs font-semibold ${tone.text}`}>{label}</Text>
    </View>
  );
};

export default AppointmentStatusPill;
