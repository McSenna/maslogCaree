import { View } from "react-native";

import AnimatedListItem from "@/components/animations/AnimatedListItem";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import InlineAlert from "@/components/feedback/InlineAlert";
import { Skeleton } from "@/components/ui/Skeleton";
import { SPACING } from "@/theme/spacing";
import type { AppointmentRecord } from "@/types/appointments.types";

import AppointmentCard from "./AppointmentCard";

type ResidentAppointmentListProps = {
  appointments: AppointmentRecord[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onBook: () => void;
  onOpen: (appointment: AppointmentRecord) => void;
  onReschedule: (appointment: AppointmentRecord) => void;
  onCancel: (appointment: AppointmentRecord) => void;
  onOpenMedicalRecord: (recordId: string) => void;
};

const AppointmentListSkeleton = () => (
  <View style={{ gap: SPACING.md }} accessibilityLabel="Loading appointments">
    {[0, 1, 2].map((key) => (
      <Skeleton key={key} className="h-36 w-full rounded-2xl" />
    ))}
  </View>
);

const ResidentAppointmentList = ({
  appointments,
  loading,
  error,
  onRetry,
  onBook,
  ...handlers
}: ResidentAppointmentListProps) => {
  const palette = useQueuePalette();

  if (loading) return <AppointmentListSkeleton />;

  if (error && !appointments.length) {
    return <ErrorState title="Unable to load appointments" message={error} onRetry={onRetry} />;
  }

  if (!appointments.length) {
    return (
      <EmptyState
        icon="calendar"
        title="No appointments yet"
        description="Your health center appointments will appear here once you send a request."
        action={{ label: "Book appointment", onPress: onBook }}
      />
    );
  }

  return (
    <View style={{ gap: SPACING.md }}>
      {error ? (
        <InlineAlert
          tone="warning"
          message="We couldn't refresh your appointments. Showing the last saved list."
          action={{ label: "Retry", onPress: onRetry }}
        />
      ) : null}
      {appointments.map((appointment, index) => (
        <AnimatedListItem key={appointment._id} index={index}>
          <AppointmentCard appointment={appointment} palette={palette} {...handlers} />
        </AnimatedListItem>
      ))}
    </View>
  );
};

export default ResidentAppointmentList;
