import { Feather } from "@expo/vector-icons";
import { Modal, Text, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import PlatformAccessModal from "@/features/auth/components/PlatformAccessModal";

import OtpDigitRow from "./otp/OtpDigitRow";
import OtpModalActions from "./otp/OtpModalActions";
import OtpModalHeader from "./otp/OtpModalHeader";
import { useOtpVerification } from "./otp/useOtpVerification";

const MC_PRIMARY = "#2A7DE1";

export type OtpVerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

const OtpVerificationModal = ({
  visible,
  email,
  onClose,
  onVerified,
}: OtpVerificationModalProps) => {
  const { logout } = useAuth();
  const otp = useOtpVerification({ email, onClose, onVerified });
  // KeyboardAvoidingView is inert inside a statusBarTranslucent modal on
  // Android, which left the keyboard over the OTP digits. Reserving the
  // keyboard's height re-centres the card in the space that is left.
  const keyboardInset = useKeyboardInset(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={otp.handleClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", paddingBottom: keyboardInset }}
      >
        <View
          className="w-full max-w-md rounded-2xl bg-white overflow-hidden self-center"
          style={{ boxShadow: "0px 12px 24px rgba(15,23,42,0.2)", elevation: 12 }}
        >
          <OtpModalHeader email={email} onClose={otp.handleClose} />

          <View className="px-5 py-5 gap-4">
            <OtpDigitRow
              otpDigits={otp.otpDigits}
              inputRefs={otp.inputRefs}
              verificationError={otp.verificationError}
              isVerifying={otp.isVerifying}
              onDigitChange={otp.handleDigitChange}
              onKeyPress={otp.handleKeyPress}
            />

            <OtpModalActions
              isResending={otp.isResending}
              resendTimer={otp.resendTimer}
              resendDisabled={otp.resendDisabled}
              isVerifying={otp.isVerifying}
              otpComplete={otp.otpComplete}
              onResend={otp.handleResend}
              onVerify={otp.handleVerify}
              onSwitchAccount={logout}
            />
          </View>

          <View className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex-row items-center gap-2">
            <Feather name="info" size={13} color={MC_PRIMARY} />
            <Text className="text-[10px] text-slate-600 flex-1 leading-relaxed">
              Can&apos;t find the email? Check your spam or junk folder.
            </Text>
          </View>
        </View>
      </View>

      <PlatformAccessModal
        visible={otp.showPlatformNotice}
        title="Account Created — Mobile App Required"
        message={
          "Your email has been verified and your MaslogCare account is ready.\n\n" +
          "Resident accounts sign in through the MaslogCare mobile application."
        }
        onClose={otp.dismissPlatformNotice}
      />
    </Modal>
  );
};

export default OtpVerificationModal;
