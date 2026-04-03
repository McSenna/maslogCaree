import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { computeAgeFromIsoDate } from "@/utils/age";
import {
  createResidentAppointment,
  fetchConsultationCategories,
  type ConsultationCategory,
} from "@/services/appointments";
import type { AppointmentProps } from "@/hooks/props";

const QUEUE_MESSAGE =
  "Your appointment is in queue. Please wait for the doctor to assign your schedule.";

const AppointmentModal = ({ visible, onClose, onBooked }: AppointmentProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [consultationType, setConsultationType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const age = computeAgeFromIsoDate(user?.dateOfBirth ?? undefined);
  const displayName = user?.name ?? "—";
  const displayAge = age != null ? `${age} years` : "—";

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      setLoadingCats(true);
      try {
        const cats = await fetchConsultationCategories();
        if (!cancelled) {
          setCategories(cats);
          setConsultationType((prev) => prev || (cats[0]?.key ?? ""));
        }
      } catch {
        if (!cancelled) {
          Alert.alert("Error", "Could not load consultation types. Check your connection.");
        }
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const handleSubmit = async () => {
    if (!consultationType) {
      Alert.alert("Consultation type", "Please select a consultation type.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createResidentAppointment({
        consultationType,
        description: description.trim(),
        isUrgent,
      });
      Alert.alert("Queued", res.message ?? QUEUE_MESSAGE);
      setDescription("");
      setIsUrgent(false);
      onBooked?.();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not submit appointment.";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="max-h-[90%] rounded-t-3xl bg-white px-4 pb-8 pt-4">
          <Text className="text-xl font-bold text-slate-900">Request appointment</Text>
          <Text className="mt-1 text-sm text-slate-600">
            You cannot pick a time yet. Requests join the medical mission queue (pending) until a doctor assigns a
            slot.
          </Text>

          <View className="mt-4 rounded-xl bg-slate-50 p-3">
            <Text className="text-xs font-semibold uppercase text-slate-500">Your profile (auto-filled)</Text>
            <Text className="mt-1 text-slate-900">
              <Text className="font-semibold">Name: </Text>
              {displayName}
            </Text>
            <Text className="text-slate-900">
              <Text className="font-semibold">Age: </Text>
              {displayAge}
            </Text>
          </View>

          <Text className="mt-4 text-sm font-semibold text-slate-800">Consultation type</Text>
          {loadingCats ? (
            <ActivityIndicator className="mt-2" color="#2D5BFF" />
          ) : (
            <ScrollView className="mt-2 max-h-40 rounded-xl border border-slate-200">
              {categories.map((c) => (
                <Pressable
                  key={c.key}
                  onPress={() => setConsultationType(c.key)}
                  className={`border-b border-slate-100 px-3 py-3 ${consultationType === c.key ? "bg-blue-50" : ""}`}
                >
                  <Text className="text-slate-900">{c.label}</Text>
                  {typeof c.durationMinutes === "number" ? (
                    <Text className="text-xs text-slate-500">{c.durationMinutes} min when scheduled</Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Text className="mt-4 text-sm font-semibold text-slate-800">Description / symptoms</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Brief description for the health team"
            className="mt-1 min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
            textAlignVertical="top"
          />

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-semibold text-slate-800">Urgent</Text>
              <Text className="text-xs text-slate-500">Raises priority in the queue when clinically appropriate.</Text>
            </View>
            <Switch value={isUrgent} onValueChange={setIsUrgent} />
          </View>

          <View className="mt-2 rounded-lg bg-amber-50 p-3">
            <Text className="text-xs text-amber-900">{QUEUE_MESSAGE}</Text>
          </View>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center rounded-xl border border-slate-300 py-3"
              disabled={submitting}
            >
              <Text className="font-medium text-slate-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleSubmit()}
              disabled={submitting || loadingCats}
              className="flex-1 items-center rounded-xl bg-mc-primary py-3"
            >
              <Text className="font-semibold text-white">{submitting ? "Submitting…" : "Submit to queue"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AppointmentModal;
