import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import MedicalRecordBottomSheet from "@/components/medicalRecord/history/MedicalRecordBottomSheet";
import InfoCard from "@/components/ui/InfoCard";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import AppointmentCard from "@/features/appointments/components/AppointmentCard";
import AppointmentDetailSheet from "@/features/appointments/components/AppointmentDetailSheet";
import AppointmentModal from "@/features/appointments/components/AppointmentModal";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import type { AppointmentRecord } from "@/services/appointments";

const ResidentAppointments = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { classes, resolvedTheme } = useTheme();
  const palette = useQueuePalette();
  const { appointments, loading, error, refresh } = useResidentAppointments();

  const [selected, setSelected] = useState<AppointmentRecord | null>(null);

  const recordViewer = useMedicalRecordViewer();

  const openRecordFor = async (recordId: string) => {
    const opened = await recordViewer.openById(recordId);
    if (opened) setSelected(null);
  };

  return (
    <>
      <ScrollView className={`flex-1 ${classes.scrollBg}`} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-4">
          <View className="flex-row flex-wrap items-start justify-between gap-3">
            <View className="min-w-0 flex-1" style={{ minWidth: 200 }}>
              <PageTitle>Appointments</PageTitle>
              <PageSubtitle>
                Request a mission visit and track scheduling from your health team.
              </PageSubtitle>
            </View>
            <Pressable
              onPress={() => setModalOpen(true)}
              className="rounded-xl bg-mc-primary px-4 py-3 active:opacity-90"
            >
              <Text className="font-semibold text-white">New request</Text>
            </Pressable>
          </View>

          <Text className={`text-sm leading-relaxed ${classes.textMuted}`}>
            Your request joins the mission queue. Date and time appear here after a doctor assigns
            your slot.
          </Text>

          {loading ? (
            <View className="gap-3">
              <StatCardSkeleton />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </View>
          ) : error ? (
            <Text
              style={{ color: resolvedTheme === "dark" ? "#fecdd3" : "#be123c" }}
              className="text-sm"
            >
              {error}
            </Text>
          ) : appointments.length === 0 ? (
            <InfoCard
              title="No appointments yet"
              description="Tap “New request” to join the medical mission queue."
              icon={<Feather name="calendar" size={18} color="#2D5BFF" />}
            />
          ) : (
            <View className="gap-3">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appointment={appt}
                  palette={palette}
                  onOpen={setSelected}
                />
              ))}
            </View>
          )}

          <AppointmentModal
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
            onBooked={() => void refresh()}
          />
        </View>
      </ScrollView>

      <AppointmentDetailSheet
        visible={Boolean(selected)}
        appointment={selected}
        palette={palette}
        onClose={() => setSelected(null)}
        onOpenMedicalRecord={(id) => void openRecordFor(id)}
        recordLoading={recordViewer.loading}
        recordError={recordViewer.error}
      />

      <MedicalRecordBottomSheet
        visible={Boolean(recordViewer.viewing)}
        record={recordViewer.viewing?.record ?? null}
        form={recordViewer.viewing?.form ?? null}
        onClose={recordViewer.close}
      />
    </>
  );
};

export default ResidentAppointments;
