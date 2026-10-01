import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Modal from "@/components/ui/AppModal";
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
  const booking = useAppointmentBooking(visible, onClose, onBooked);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={booking.close} transparent={false}>
      <View className="flex-1" style={{ backgroundColor: APPOINTMENT_COLORS.pageBg }}>
        {/* "padding" on Android too: with edge-to-edge the OS does not reliably
            resize this window for the keyboard. KeyboardAvoidingView measures the
            real overlap against its own frame, so it adds nothing when the OS did. */}
        <KeyboardAvoidingView className="flex-1" behavior="padding">
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
            <AppointmentFormHeader onClose={booking.close} disabled={booking.submitting} />
            <StepProgress step={booking.step} />

            {booking.booked ? (
              <BookingConfirmedStep appointment={booking.booked} onClose={booking.close} />
            ) : (
              <BookingRequestStep booking={booking} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AppointmentModal;
