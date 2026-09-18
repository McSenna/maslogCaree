import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { BREAKPOINTS } from "@/constants/breakpoints";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import AppointmentInformation from "./AppointmentInformation";
import AssessmentSection from "./AssessmentSection";
import FollowUpSection from "./FollowUpSection";
import ItemsGivenSection from "./ItemsGivenSection";
import MedicalDetailsSection from "./MedicalDetailsSection";
import MedicalRecordHeader from "./MedicalRecordHeader";
import MedicalRecordTimeline from "./MedicalRecordTimeline";
import PatientInformation from "./PatientInformation";
import ProviderInformation from "./ProviderInformation";
import RecommendationSection from "./RecommendationSection";
import { buildDetailGroups, buildFollowUp, buildTimeline, serviceLabelOf } from "./recordPresenter";

const MedicalRecordBottomSheet = ({
  visible,
  record,
  form,
  loading = false,
  onClose,
}: {
  visible: boolean;
  record: MedicalRecord | null;
  form: CompletionForm | null;
  loading?: boolean;
  onClose: () => void;
}) => {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();

  const groups = useMemo(() => {
    if (!record) return [];
    if (!form && loading) return [];
    return buildDetailGroups(record, form);
  }, [record, form, loading]);
  const followUp = useMemo(() => (record ? buildFollowUp(record, form) : null), [record, form]);
  const timeline = useMemo(() => (record ? buildTimeline(record) : []), [record]);

  if (!record) return null;

  const vitalColumns = width >= BREAKPOINTS.sm ? 3 : 2;

  const header = (requestClose: () => void) => (
    <View
      className="w-full gap-3 px-5 pb-4 pt-2"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <View className="w-full flex-row items-start gap-3">
        <View className="min-w-0 flex-1">
          <MedicalRecordHeader record={record} palette={palette} />
        </View>

        <Pressable
          onPress={requestClose}
          accessibilityRole="button"
          accessibilityLabel="Close medical record"
          hitSlop={12}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
          style={{ backgroundColor: palette.skeleton }}
        >
          <Feather name="x" size={17} color={palette.muted} />
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color={palette.primary} />
          <Text className="text-[12px]" style={{ color: palette.muted }}>
            Loading the full record…
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      accessibilityLabel={`${serviceLabelOf(record)} medical record`}
      surface={palette.panelBg}
      handleColor={palette.divider}
      scrim={palette.isDark ? "rgba(2,6,23,0.6)" : "rgba(15,37,87,0.35)"}
    >
      <ScrollView
        className="flex-1"
        style={SHEET_SCROLL_STYLE}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 16 }}
      >
        <PatientInformation record={record} palette={palette} />

        <MedicalDetailsSection groups={groups} palette={palette} vitalColumns={vitalColumns} />

        <AssessmentSection record={record} palette={palette} />

        <RecommendationSection record={record} palette={palette} />

        <ItemsGivenSection record={record} palette={palette} />

        <FollowUpSection followUp={followUp} palette={palette} />

        <ProviderInformation record={record} palette={palette} />

        <AppointmentInformation record={record} palette={palette} />

        <MedicalRecordTimeline steps={timeline} palette={palette} />
      </ScrollView>
    </BottomSheet>
  );
};

export default MedicalRecordBottomSheet;
