import { View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import ProfileAppointmentCard from "../cards/ProfileAppointmentCard";
import ProfileTabState from "../common/ProfileTabState";

type AppointmentsTabProps = {
  appointments: AppointmentRecord[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  isResident: boolean;
  twoColumn: boolean;
};

const AppointmentsTab = ({
  appointments,
  loading,
  error,
  onRetry,
  isResident,
  twoColumn,
}: AppointmentsTabProps) => {
  const fallback = (
    <ProfileTabState
      loading={loading}
      error={error}
      isEmpty={appointments.length === 0}
      emptyIcon="calendar"
      emptyTitle={isResident ? "No appointments yet" : "No scheduled appointments"}
      emptyBody={
        isResident
          ? "Once you book a health service, your appointments will appear here."
          : "Appointments assigned to your queue will appear here."
      }
      onRetry={onRetry}
    />
  );

  if (loading || error || appointments.length === 0) return fallback;

  return (
    <View
      style={{
        flexDirection: twoColumn ? "row" : "column",
        flexWrap: twoColumn ? "wrap" : "nowrap",
        gap: 12,
      }}
    >
      {appointments.map((appointment) => (
        <View
          key={appointment._id}
          style={{ width: twoColumn ? "48.6%" : "100%", minWidth: 0 }}
        >
          <ProfileAppointmentCard appointment={appointment} />
        </View>
      ))}
    </View>
  );
};

export default AppointmentsTab;
