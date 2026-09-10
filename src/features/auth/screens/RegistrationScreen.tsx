import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import DateOfBirthSheet from "../components/DateOfBirthSheet";
import OtpVerificationModal from "../components/OtpVerificationModal";
import RegistrationForm from "../components/RegistrationForm";
import RegistrationHeader from "../components/RegistrationHeader";
import RegistrationSubmitBar from "../components/RegistrationSubmitBar";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

type RegistrationScreenProps = {
  onRegistrationSuccess?: () => void;
  onBackPress?: () => void;
};

/**
 * Resident sign-up.
 *
 * Two steps behind one screen: the form creates the account, and the OTP sheet
 * that follows verifies it. The account is not usable until the code is
 * entered, which is why the form is only cleared once that sheet closes.
 */
export default function RegistrationScreen({
  onRegistrationSuccess,
  onBackPress,
}: RegistrationScreenProps) {
  const form = useRegistrationForm(onRegistrationSuccess);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1">
        <RegistrationHeader onBackPress={onBackPress} />

        <ScrollView
          ref={form.scrollRef}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 160 : 140,
            paddingTop: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <RegistrationForm form={form} />
        </ScrollView>

        <RegistrationSubmitBar isLoading={form.isLoading} onSubmit={() => void form.submit()} />
      </View>

      <DateOfBirthSheet
        visible={form.showDatePicker}
        value={form.values.dateOfBirth}
        onConfirm={form.setDateOfBirth}
        onClose={form.closeDatePicker}
      />

      <OtpVerificationModal
        visible={form.showOtpModal}
        email={form.registeredEmail}
        onVerified={form.handleOtpVerified}
        onClose={form.handleOtpDismissed}
      />
    </KeyboardAvoidingView>
  );
}
