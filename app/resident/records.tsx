import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { useMemo } from "react";

import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { getAssignedStaffName } from "@/utils/appointmentDisplay";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";
import MedicalRecordsLink from "@/features/resident/records/MedicalRecordsLink";
import RecordCard from "@/features/resident/records/RecordCard";
import StatCard from "@/features/resident/records/StatCard";
import { formatWhen } from "@/features/resident/records/recordPresentation";
import ResidentMedicalDetailsDialog from "@/features/medical-records/components/ResidentMedicalDetailsDialog";
import { medicalRecordIdOf } from "@/features/appointments/appointmentPresenter";
import type { AppointmentRecord } from "@/types/appointments.types";

const ResidentRecords = () => {
  const { classes } = useTheme();
  const { appointments, loading, error } = useResidentAppointments();
  const recordViewer = useMedicalRecordViewer();

  const sorted = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const ta = new Date(a.slotStart || a.createdAt || 0).getTime();
      const tb = new Date(b.slotStart || b.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [appointments]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    return { total, pending, completed };
  }, [appointments]);

  const handleOpenRecord = (appointment: AppointmentRecord) => {
    const recordId = medicalRecordIdOf(appointment);
    if (recordId) void recordViewer.openById(recordId);
  };

  return (
    <>
      <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          <View className="gap-1">
            <PageTitle>Medical records</PageTitle>
            <PageSubtitle>
              Your care history from MaslogCare — what your health worker recorded, and every appointment you
              have booked.
            </PageSubtitle>
          </View>

          <MedicalRecordsLink completedCount={stats.completed} />

          {loading ? (
            <View className="gap-3">
              <StatCardSkeleton />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </View>
          ) : error ? (
            <View className="flex-row items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <Feather name="alert-circle" size={18} color="#E11D48" />
              <Text className="flex-1 text-sm leading-5 text-rose-700">{error}</Text>
            </View>
          ) : sorted.length === 0 ? (
            <InfoCard
              title="No records yet"
              description="When you book appointments, they will show up here as your health timeline."
              icon={<Feather name="file-text" size={18} color="#2D5BFF" />}
            />
          ) : (
            <View className="gap-5">
              <View className="flex-row gap-3">
                <StatCard label="Total" value={stats.total} icon="calendar" tone="blue" />
                <StatCard label="Pending" value={stats.pending} icon="clock" tone="amber" />
                <StatCard label="Completed" value={stats.completed} icon="check-circle" tone="teal" />
              </View>

              <View className="gap-3">
                <Text className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Appointment history
                </Text>
                {sorted.map((appt) => {
                  const typeLabel = formatConsultationTypeLabel(appt.consultationType);
                  const staff = getAssignedStaffName(appt.assignedBy);
                  const isCompleted = appt.status === "completed";
                  const recId = medicalRecordIdOf(appt);

                  return (
                    <RecordCard
                      key={appt._id}
                      typeLabel={typeLabel}
                      status={appt.status}
                      when={formatWhen(appt)}
                      staff={staff}
                      description={appt.description}
                      declineReason={appt.declineReason}
                      cancelReason={appt.cancelReason}
                      hasRecord={isCompleted && Boolean(recId)}
                      onPress={isCompleted && recId ? () => handleOpenRecord(appt) : undefined}
                    />
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <ResidentMedicalDetailsDialog
        visible={recordViewer.isOpen}
        record={recordViewer.record}
        form={recordViewer.form}
        loading={recordViewer.loading}
        error={recordViewer.error}
        onRetry={recordViewer.retry}
        onClose={recordViewer.close}
      />
    </>
  );
};

export default ResidentRecords;
