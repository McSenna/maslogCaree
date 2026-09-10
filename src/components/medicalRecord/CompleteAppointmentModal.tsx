import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import {
  completeAppointment,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";
import MedicalRecordForm, {
  toMedicalRecordInput,
  useMedicalRecordForm,
} from "./MedicalRecordForm";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

/** Below this the sheet rises from the bottom instead of floating centred. */
const SHEET_WIDTH = 768;

function PatientSummary({ appointment, serviceLabel }: { appointment: AppointmentRecord; serviceLabel: string }) {
  const palette = useQueuePalette();
  const when = appointment.slotStart ? formatDateTime(appointment.slotStart) : null;

  return (
    <View
      className="w-full gap-1 p-3.5"
      style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[15px] font-bold" style={{ color: palette.heading }}>
        {appointment.resident?.fullname || "Unnamed patient"}
      </Text>
      <Text className="text-[12.5px] font-medium" style={{ color: palette.primary }}>
        {serviceLabel}
      </Text>
      {when ? (
        <Text className="text-[12px]" style={{ color: palette.muted }}>
          {when.date} · {when.time}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * The last step before a visit is closed.
 *
 * Deliberately a second screen rather than a dialog over the form: the sentence
 * that matters — the patient leaves the queue — is easy to skip in a strip
 * above a Save button, and this is the point of no return.
 */
function ConfirmStep({
  onBack,
  onConfirm,
  saving,
}: {
  onBack: () => void;
  onConfirm: () => void;
  saving: boolean;
}) {
  const palette = useQueuePalette();

  return (
    <View className="w-full gap-4 py-2">
      <View className="items-center gap-3 py-2">
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.tones.green.bg }}
        >
          <Feather name="check-circle" size={26} color={palette.tones.green.fg} />
        </View>
        <Text accessibilityRole="header" className="text-center text-[17px] font-bold" style={{ color: palette.heading }}>
          Complete this appointment?
        </Text>
        <Text className="text-center text-[13px] leading-[19px]" style={{ color: palette.muted }}>
          Saving this medical record will mark the appointment as completed and remove the patient from the active
          queue.
        </Text>
      </View>

      <View className="w-full flex-row gap-2.5">
        <Pressable
          onPress={onBack}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Go back to the medical record form"
          className="h-11 flex-1 items-center justify-center"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            borderWidth: 1,
            borderColor: palette.panelBorder,
            opacity: saving ? 0.5 : 1,
          }}
        >
          <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
            Go Back
          </Text>
        </Pressable>

        <Pressable
          onPress={onConfirm}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Confirm completion"
          className="h-11 flex-1 flex-row items-center justify-center gap-2"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            backgroundColor: palette.primary,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
          <Text className="text-[14px] font-semibold text-white">
            {saving ? "Saving…" : "Confirm Completion"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Completes an appointment: fill the record, confirm, save.
 *
 * A centred dialog with room for the form on a wide screen, a bottom sheet on
 * a phone — one component rather than two, because the content and every rule
 * about it are identical and only the container differs.
 *
 * Nothing is written until Confirm. Opening this changes no state on the
 * server, which is what lets a health worker back out of a card they opened by
 * mistake without the patient's status having moved.
 */
export default function CompleteAppointmentModal({
  visible,
  appointment,
  form,
  serviceLabel,
  onClose,
  onCompleted,
}: {
  visible: boolean;
  appointment: AppointmentRecord | null;
  /** The form for this appointment's service. Null while the catalogue loads. */
  form: CompletionForm | null;
  serviceLabel: string;
  onClose: () => void;
  /** Fired after a successful save, so the caller can refresh and toast. */
  onCompleted: (result: { appointment: AppointmentRecord; medicalRecord: MedicalRecord | null; alreadyCompleted?: boolean }) => void;
}) {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();
  const isSheet = width < SHEET_WIDTH;

  const { values, errors, setErrors, onChange, reset, validate } = useMedicalRecordForm(form);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // A fresh form each time the sheet opens on a new patient — a record must
  // never carry a field left over from the last visit.
  useEffect(() => {
    if (!visible) return;
    reset(form);
    setStep("form");
    setSaving(false);
    setSubmitError(null);
  }, [visible, form, reset]);

  const handleReview = useCallback(() => {
    setSubmitError(null);
    if (!validate()) return;
    setStep("confirm");
  }, [validate]);

  const handleConfirm = useCallback(async () => {
    if (!appointment || !form || saving) return;

    setSaving(true);
    setSubmitError(null);
    try {
      const result = await completeAppointment(appointment._id, toMedicalRecordInput(form, values));
      onCompleted(result);
    } catch (e: unknown) {
      // Back to the form, where the message can sit next to what caused it.
      setStep("form");
      const message = getApiErrorMessage(e, "The appointment could not be completed.");
      setSubmitError(message);
      const fieldErrors = (e as { errors?: string[] })?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        setSubmitError(fieldErrors.join(" "));
      }
      setErrors((prev) => ({ ...prev }));
    } finally {
      setSaving(false);
    }
  }, [appointment, form, values, saving, onCompleted, setErrors]);

  const title = useMemo(() => (step === "confirm" ? "Confirm completion" : "Complete Appointment"), [step]);

  if (!appointment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={() => !saving && onClose()}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close without completing"
          onPress={() => !saving && onClose()}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 620,
            maxHeight: isSheet ? "92%" : "88%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }} />
            </View>
          ) : null}

          <View
            className="flex-row items-center justify-between gap-3 px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <Text accessibilityRole="header" className="min-w-0 flex-1 text-[17px] font-bold" style={{ color: palette.heading }}>
              {title}
            </Text>
            <Pressable
              onPress={() => !saving && onClose()}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Close without completing"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.skeleton, opacity: saving ? 0.5 : 1 }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, gap: 14 }}
          >
            <PatientSummary appointment={appointment} serviceLabel={serviceLabel} />

            {submitError ? (
              <View
                className="w-full flex-row items-start gap-2.5 p-3"
                style={{
                  borderRadius: QUEUE_RADIUS.control,
                  borderWidth: 1,
                  borderColor: palette.isDark ? "rgba(220,38,38,0.32)" : "#FECACA",
                  backgroundColor: palette.isDark ? "rgba(220,38,38,0.14)" : "#FEF2F2",
                }}
              >
                <Feather name="alert-circle" size={15} color="#DC2626" style={{ marginTop: 1 }} />
                <Text className="min-w-0 flex-1 text-[12.5px] font-medium leading-[17px]" style={{ color: "#DC2626" }}>
                  {submitError}
                </Text>
              </View>
            ) : null}

            {step === "confirm" ? (
              <ConfirmStep onBack={() => setStep("form")} onConfirm={() => void handleConfirm()} saving={saving} />
            ) : form ? (
              <MedicalRecordForm
                form={form}
                values={values}
                errors={errors}
                onChange={onChange}
                disabled={saving}
              />
            ) : (
              <View className="items-center gap-2 py-10">
                <ActivityIndicator size="small" color={palette.primary} />
                <Text className="text-[12.5px]" style={{ color: palette.muted }}>
                  Loading the form for this service…
                </Text>
              </View>
            )}
          </ScrollView>

          {step === "form" ? (
            <View
              className="flex-row gap-2.5 px-4 py-3.5"
              style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
            >
              <Pressable
                onPress={onClose}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                className="h-11 flex-1 items-center justify-center"
                style={{
                  borderRadius: QUEUE_RADIUS.control,
                  borderWidth: 1,
                  borderColor: palette.panelBorder,
                  opacity: saving ? 0.5 : 1,
                }}
              >
                <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleReview}
                disabled={saving || !form}
                accessibilityRole="button"
                accessibilityLabel="Save and complete appointment"
                className="h-11 items-center justify-center px-5"
                style={{
                  flex: 1.4,
                  borderRadius: QUEUE_RADIUS.control,
                  backgroundColor: palette.primary,
                  opacity: saving || !form ? 0.6 : 1,
                }}
              >
                <Text className="text-[14px] font-semibold text-white">Save &amp; Complete</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
