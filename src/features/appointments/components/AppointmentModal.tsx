import { KeyboardAvoidingView, Modal, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppointmentBooking } from "../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "./appointmentTheme";
import AppointmentFormHeader from "./AppointmentFormHeader";
import BookingConfirmedStep from "./BookingConfirmedStep";
import BookingRequestStep from "./BookingRequestStep";
import StepProgress from "./StepProgress";

export type AppointmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onBooked?: () => void;
};

const AppointmentModal = ({
  visible,
  onClose,
  onBooked,
}: AppointmentModalProps) => {
  const insets = useSafeAreaInsets();
  const booking = useAppointmentBooking(visible, onBooked);

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
            <AppointmentFormHeader onClose={onClose} disabled={booking.submitting} />
            <StepProgress step={booking.step} />

            {booking.step === 1 ? (
              <BookingRequestStep booking={booking} onClose={onClose} />
            ) : (
              <BookingConfirmedStep booking={booking} onClose={onClose} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
