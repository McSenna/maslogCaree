import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  createResidentAppointment,
  fetchConsultationCategories,
  type ConsultationCategory,
} from "@/services/appointments";
import {
  APPOINTMENT_FIELD_ICONS,
  SERVICE_TYPES,
} from "@/config/appointmentServices";
import {
  APPOINTMENT_COLORS,
  APPOINTMENT_METRICS,
  TEXT_LIMIT,
} from "@/components/appointments/appointmentTheme";
import FormSelectField, {
  type SelectOption,
} from "@/components/appointments/FormSelectField";
import FormTextArea from "@/components/appointments/FormTextArea";
import ResidentInfoCard, {
  formatResidentReference,
} from "@/components/appointments/ResidentInfoCard";
import StepProgress from "@/components/appointments/StepProgress";
import type { AppointmentProps } from "@/hooks/props";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { formatRoleLabel } from "@/utils/roleLabel";

const AUTO_SCHEDULE_NOTE =
  "Your appointment schedule and time will be automatically assigned based on availability.";

const QUEUE_MESSAGE =
  "Your appointment is in queue. Please wait for the health team to assign your schedule.";

type FormErrors = {
  serviceType?: string;
  reason?: string;
  confirmed?: string;
};

/**
 * Book an Appointment — the resident's request form.
 *
 * Step 1 collects the request; step 2 is the result the queue returns. The
 * resident never picks a date: MaslogCare assigns the slot from the mission
 * schedule, which is why the form asks what is needed to triage the request
 * and nothing more.
 */
const AppointmentModal = ({ visible, onClose, onBooked }: AppointmentProps) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2>(1);

  // Service catalogue
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resident = useMemo(
    () => ({
      name: user?.name || "—",
      residentId: formatResidentReference(user?.id),
      address: user?.address || "Not provided",
      phone: user?.phone || "Not provided",
      email: user?.email || "Not provided",
    }),
    [user]
  );

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const list = await fetchConsultationCategories();
      // The server owns the catalogue; anything it marks as not bookable by a
      // resident is dropped rather than shown and rejected on submit.
      setCategories(list.filter((c) => c.residentBookable !== false));
    } catch (error: unknown) {
      setCategories([]);
      setServicesError(
        getApiErrorMessage(error, "Unable to load services. Please try again.")
      );
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Reset to a clean step 1 every time the form is opened, so a previous
  // request's answers are never pre-filled into a new one.
  useEffect(() => {
    if (!visible) return;
    setStep(1);
    setServiceType(null);
    setReason("");
    setNotes("");
    setConfirmed(false);
    setErrors({});
    setSubmitError(null);
    void loadServices();
  }, [visible, loadServices]);

  const serviceOptions: SelectOption[] = useMemo(() => {
    // Who handles the service, said plainly under it. The resident never picks
    // a role — the service decides it — so this is the one place they are told
    // which health worker their request is going to. The role comes from the
    // server catalogue, so the form states the routing rather than guessing it.
    const withHandler = (description?: string, queueRole?: string) => {
      const handler = formatRoleLabel(queueRole);
      if (!handler) return description;
      return description ? `${description} · Handled by ${handler}` : `Handled by ${handler}`;
    };

    const source = categories.length
      ? categories.map((c) => ({
          id: c.key,
          label: c.label,
          helper: withHandler(c.description, c.queueRole),
        }))
      : // Offline fallback: the same approved five, from the shared catalogue.
        SERVICE_TYPES.map((s) => ({
          id: s.id,
          label: s.label,
          helper: withHandler(s.description, s.queueRole),
        }));
    return source;
  }, [categories]);

  const selectedService = serviceOptions.find((o) => o.id === serviceType) ?? null;
  const servicesUnavailable = !servicesLoading && serviceOptions.length === 0;

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!serviceType) next.serviceType = "Please select a service type.";
    if (!reason.trim()) {
      next.reason = "Please describe your reason for visit or symptoms.";
    }
    if (!confirmed) {
      next.confirmed = "Please confirm that the appointment details are correct.";
    }
    return next;
  };

  const isComplete =
    Boolean(serviceType) &&
    Boolean(reason.trim()) &&
    confirmed;

  const handleSubmit = async () => {
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createResidentAppointment({
        consultationType: serviceType as string,
        description: reason.trim(),
        additionalNotes: notes.trim(),
      });
      onBooked?.();
      setStep(2);
    } catch (error: unknown) {
      setSubmitError(
        getApiErrorMessage(error, "Could not submit your appointment request. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <View className="flex-1" style={{ backgroundColor: APPOINTMENT_COLORS.pageBg }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: Math.max(insets.top, 12) + 4,
              paddingBottom: Math.max(insets.bottom, 16) + 20,
              paddingHorizontal: 16,
              gap: 16,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <View
                className="items-center justify-center"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  backgroundColor: APPOINTMENT_COLORS.surfaceTintStrong,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={24}
                  color={APPOINTMENT_COLORS.primaryBright}
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  accessibilityRole="header"
                  style={{ fontSize: 21, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
                >
                  Book an Appointment
                </Text>
                <Text style={{ fontSize: 13.5, color: APPOINTMENT_COLORS.mutedText }}>
                  Resident Appointment Form
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close appointment form"
                hitSlop={12}
                onPress={onClose}
                disabled={submitting}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: APPOINTMENT_COLORS.surfaceTint }}
              >
                <Feather name="x" size={17} color={APPOINTMENT_COLORS.mutedText} />
              </Pressable>
            </View>

            <StepProgress step={step} />

            {step === 1 ? (
              <>
                <ResidentInfoCard resident={resident} />

                <View style={{ gap: 12 }}>
                  <Text
                    accessibilityRole="header"
                    style={{ fontSize: 18, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
                  >
                    Appointment Details
                  </Text>

                  <View
                    className="flex-row items-start"
                    style={{
                      gap: 10,
                      borderRadius: APPOINTMENT_METRICS.radiusField,
                      backgroundColor: APPOINTMENT_COLORS.surfaceTint,
                      padding: 12,
                    }}
                  >
                    <Feather name="info" size={17} color={APPOINTMENT_COLORS.primaryBright} />
                    <Text
                      className="min-w-0 flex-1"
                      style={{
                        fontSize: 13,
                        lineHeight: 19,
                        color: APPOINTMENT_COLORS.bodyText,
                      }}
                    >
                      {AUTO_SCHEDULE_NOTE}
                    </Text>
                  </View>

                  {servicesError ? (
                    <View
                      className="flex-row items-center"
                      style={{
                        gap: 10,
                        borderRadius: APPOINTMENT_METRICS.radiusField,
                        borderWidth: 1,
                        borderColor: APPOINTMENT_COLORS.dangerBorder,
                        backgroundColor: APPOINTMENT_COLORS.dangerBg,
                        padding: 12,
                      }}
                    >
                      <Feather
                        name="alert-triangle"
                        size={16}
                        color={APPOINTMENT_COLORS.danger}
                      />
                      <Text
                        className="min-w-0 flex-1"
                        style={{ fontSize: 13, color: "#991B1B" }}
                      >
                        Unable to load services. Please try again.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Retry loading services"
                        onPress={() => void loadServices()}
                        className="items-center justify-center rounded-lg px-3"
                        style={{
                          height: 34,
                          backgroundColor: APPOINTMENT_COLORS.white,
                          borderWidth: 1,
                          borderColor: APPOINTMENT_COLORS.dangerBorder,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: APPOINTMENT_COLORS.danger,
                          }}
                        >
                          Retry
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}

                  <FormSelectField
                    label="Service Type"
                    required
                    sheetTitle="Select service type"
                    placeholder="Select service type"
                    icon={APPOINTMENT_FIELD_ICONS.service}
                    options={serviceOptions}
                    value={serviceType}
                    onChange={(id) => {
                      setServiceType(id);
                      setErrors((prev) => ({ ...prev, serviceType: undefined }));
                    }}
                    error={errors.serviceType}
                    loading={servicesLoading}
                    loadingText="Loading services…"
                    disabled={servicesUnavailable}
                    emptyText="No appointment services are currently available."
                    helperText={selectedService?.helper ?? null}
                  />

                  <FormTextArea
                    label="Reason for Visit / Symptoms"
                    required
                    placeholder="Describe your symptoms or reason for visit..."
                    icon={APPOINTMENT_FIELD_ICONS.reason}
                    value={reason}
                    onChangeText={(next) => {
                      setReason(next);
                      if (next.trim()) setErrors((prev) => ({ ...prev, reason: undefined }));
                    }}
                    error={errors.reason}
                    maxLength={TEXT_LIMIT}
                  />

                  <FormTextArea
                    label="Additional Notes"
                    optional
                    placeholder="Add any additional information (optional)..."
                    icon={APPOINTMENT_FIELD_ICONS.notes}
                    value={notes}
                    onChangeText={setNotes}
                    maxLength={TEXT_LIMIT}
                    minHeight={80}
                  />
                </View>

                {/* Confirmation */}
                <View>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: confirmed }}
                    accessibilityLabel="I confirm that the appointment details provided are correct, required"
                    onPress={() => {
                      setConfirmed((prev) => !prev);
                      setErrors((prev) => ({ ...prev, confirmed: undefined }));
                    }}
                    className="flex-row items-start"
                    style={{ gap: 10, minHeight: 44, paddingVertical: 2 }}
                  >
                    <View
                      className="items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        marginTop: 1,
                        borderWidth: confirmed ? 0 : 1.5,
                        borderColor: errors.confirmed
                          ? APPOINTMENT_COLORS.danger
                          : APPOINTMENT_COLORS.borderStrong,
                        backgroundColor: confirmed
                          ? APPOINTMENT_COLORS.primaryBright
                          : APPOINTMENT_COLORS.white,
                      }}
                    >
                      {confirmed ? <Feather name="check" size={15} color="#FFFFFF" /> : null}
                    </View>
                    <Text
                      className="min-w-0 flex-1"
                      style={{
                        fontSize: 13.5,
                        lineHeight: 19,
                        color: APPOINTMENT_COLORS.bodyText,
                      }}
                    >
                      I confirm that the appointment details provided are correct.
                      <Text style={{ color: APPOINTMENT_COLORS.danger }}> *</Text>
                    </Text>
                  </Pressable>

                  {errors.confirmed ? (
                    <View className="mt-1.5 flex-row items-center" style={{ gap: 6 }}>
                      <Feather name="alert-circle" size={13} color={APPOINTMENT_COLORS.danger} />
                      <Text
                        accessibilityRole="alert"
                        style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.danger }}
                      >
                        {errors.confirmed}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {submitError ? (
                  <View
                    className="flex-row items-start"
                    style={{
                      gap: 10,
                      borderRadius: APPOINTMENT_METRICS.radiusField,
                      borderWidth: 1,
                      borderColor: APPOINTMENT_COLORS.dangerBorder,
                      backgroundColor: APPOINTMENT_COLORS.dangerBg,
                      padding: 12,
                    }}
                  >
                    <Feather name="alert-triangle" size={16} color={APPOINTMENT_COLORS.danger} />
                    <Text
                      accessibilityRole="alert"
                      className="min-w-0 flex-1"
                      style={{ fontSize: 13, lineHeight: 18, color: "#991B1B" }}
                    >
                      {submitError}
                    </Text>
                  </View>
                ) : null}

                {/* Actions */}
                <View style={{ gap: 10 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Book Appointment"
                    accessibilityState={{ disabled: submitting || servicesUnavailable, busy: submitting }}
                    onPress={() => void handleSubmit()}
                    // Disabled only when submitting or when there is nothing to
                    // book. With fields still missing it stays pressable but
                    // dimmed, so pressing it explains what is missing instead of
                    // leaving a dead button and no reason.
                    disabled={submitting || servicesUnavailable}
                    className="w-full flex-row items-center justify-center active:opacity-90"
                    style={{
                      height: APPOINTMENT_METRICS.buttonHeight,
                      gap: 9,
                      borderRadius: APPOINTMENT_METRICS.radiusField,
                      backgroundColor: APPOINTMENT_COLORS.actionGreen,
                      opacity: submitting || servicesUnavailable ? 0.55 : isComplete ? 1 : 0.75,
                      ...Platform.select({ web: { cursor: "pointer" } as any }),
                    }}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Feather name="send" size={17} color="#FFFFFF" />
                    )}
                    <Text style={{ fontSize: 15.5, fontWeight: "700", color: "#FFFFFF" }}>
                      {submitting ? "Booking Appointment..." : "Book Appointment"}
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cancel"
                    onPress={onClose}
                    disabled={submitting}
                    className="w-full items-center justify-center active:opacity-80"
                    style={{
                      height: APPOINTMENT_METRICS.buttonHeight,
                      borderRadius: APPOINTMENT_METRICS.radiusField,
                      backgroundColor: APPOINTMENT_COLORS.neutralBg,
                      opacity: submitting ? 0.6 : 1,
                      ...Platform.select({ web: { cursor: "pointer" } as any }),
                    }}
                  >
                    <Text
                      style={{ fontSize: 15.5, fontWeight: "700", color: APPOINTMENT_COLORS.primary }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              /* Step 2 — what the queue returned. */
              <View style={{ gap: 16 }}>
                <View
                  className="items-center"
                  style={{
                    borderRadius: APPOINTMENT_METRICS.radiusCard,
                    backgroundColor: APPOINTMENT_COLORS.surfaceTint,
                    paddingHorizontal: 18,
                    paddingVertical: 24,
                    gap: 10,
                  }}
                >
                  <View
                    className="items-center justify-center"
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 31,
                      backgroundColor: APPOINTMENT_COLORS.successBg,
                    }}
                  >
                    <Feather name="check" size={30} color={APPOINTMENT_COLORS.success} />
                  </View>
                  <Text
                    accessibilityRole="header"
                    className="text-center"
                    style={{ fontSize: 19, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
                  >
                    Appointment Requested
                  </Text>
                  <Text
                    className="text-center"
                    style={{ fontSize: 13.5, lineHeight: 20, color: APPOINTMENT_COLORS.mutedText }}
                  >
                    {QUEUE_MESSAGE}
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: APPOINTMENT_METRICS.radiusCard,
                    borderWidth: 1,
                    borderColor: APPOINTMENT_COLORS.border,
                    padding: 14,
                    gap: 12,
                  }}
                >
                  <SummaryRow label="Service Type" value={selectedService?.label ?? "—"} />
                  <SummaryRow label="Healthcare Provider" value="To be assigned" />
                  <SummaryRow label="Reason for Visit" value={reason.trim() || "—"} />
                  {notes.trim() ? (
                    <SummaryRow label="Additional Notes" value={notes.trim()} />
                  ) : null}
                  <SummaryRow label="Schedule" value="Assigned automatically by the health team" />
                  <SummaryRow label="Status" value="Pending" />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Done"
                  onPress={onClose}
                  className="w-full items-center justify-center active:opacity-90"
                  style={{
                    height: APPOINTMENT_METRICS.buttonHeight,
                    borderRadius: APPOINTMENT_METRICS.radiusField,
                    backgroundColor: APPOINTMENT_COLORS.actionGreen,
                    ...Platform.select({ web: { cursor: "pointer" } as any }),
                  }}
                >
                  <Text style={{ fontSize: 15.5, fontWeight: "700", color: "#FFFFFF" }}>Done</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: APPOINTMENT_COLORS.mutedText,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "500", color: APPOINTMENT_COLORS.bodyText }}>
        {value}
      </Text>
    </View>
  );
}

export default AppointmentModal;
