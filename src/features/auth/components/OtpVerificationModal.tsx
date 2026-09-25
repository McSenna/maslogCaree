import { useId } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

import FieldMessage from "@/components/forms/FieldMessage";
import BrandedDialogHeader from "@/components/ui/dialog/BrandedDialogHeader";
import OtpCodeInput from "@/components/ui/OtpCodeInput";
import { useThemedOtpPalette } from "@/components/ui/otp/useThemedOtpPalette";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useAuth } from "@/contexts/AuthContext";
import PlatformAccessModal from "@/features/auth/components/PlatformAccessModal";
import { maskEmail } from "@/features/auth/registration/components/email/verificationCopy";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useReducedMotion } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SHADOWS } from "@/theme/shadows";
import { SPACING } from "@/theme/spacing";

import OtpModalActions from "./otp/OtpModalActions";
import OtpSpamHint from "./otp/OtpSpamHint";
import { OTP_LENGTH, useOtpVerification } from "./otp/useOtpVerification";

const CARD_EDGE = SPACING.lg;

export type OtpVerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

const OtpVerificationModal = ({ visible, email, onClose, onVerified }: OtpVerificationModalProps) => {
  const { logout } = useAuth();
  const colors = useThemeColors();
  const palette = useThemedOtpPalette();
  const reducedMotion = useReducedMotion();
  const messageId = useId();
  const otp = useOtpVerification({ email, onClose, onVerified });
  const layout = useSheetLayout({ enabled: visible, variant: "centered", edgePadding: CARD_EDGE });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={backDismissesKeyboardFirst(layout, otp.handleClose)}
      statusBarTranslucent
    >
      <SheetViewport layout={layout} style={{ backgroundColor: colors.overlay, paddingHorizontal: CARD_EDGE }}>
        <View
          style={[
            {
              width: "100%",
              maxWidth: 440,
              maxHeight: layout.maxHeight,
              alignSelf: "center",
              overflow: "hidden",
              borderRadius: RADII.modal,
              backgroundColor: colors.surface,
            },
            SHADOWS.overlay,
          ]}
        >
          <BrandedDialogHeader
            icon="shield"
            eyebrow="Email verification"
            title="Verify your email"
            closeLabel="Close verification"
            onClose={otp.handleClose}
            description={
              <>
                We sent a {OTP_LENGTH}-digit code to{" "}
                <Text style={{ fontWeight: "700", color: "#FFFFFF" }}>{maskEmail(email)}</Text>.
              </>
            }
          />

          <ScrollView
            style={{ flexGrow: 0, flexShrink: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: SPACING.xl - 4, gap: SPACING.lg }}
          >
            <View style={{ gap: SPACING.sm }}>
              <OtpCodeInput
                label="Verification code"
                value={otp.code}
                onChange={otp.setCode}
                onSubmit={() => void otp.handleVerify()}
                palette={palette}
                length={OTP_LENGTH}
                disabled={otp.isVerifying || otp.verified}
                invalid={Boolean(otp.verificationError)}
                success={otp.verified}
                describedBy={messageId}
                focusRequest={otp.focusRequest}
                reducedMotion={reducedMotion}
              />
              <FieldMessage
                nativeID={messageId}
                error={otp.verificationError || null}
                helper={otp.verified ? "Email verified" : "Paste the code or type it digit by digit."}
              />
            </View>

            <OtpModalActions
              isResending={otp.isResending}
              resendTimer={otp.resendTimer}
              resendDisabled={otp.resendDisabled}
              isVerifying={otp.isVerifying}
              verified={otp.verified}
              otpComplete={otp.otpComplete}
              onResend={() => void otp.handleResend()}
              onVerify={() => void otp.handleVerify()}
              onSwitchAccount={logout}
            />
          </ScrollView>

          <OtpSpamHint />
        </View>
      </SheetViewport>

      <PlatformAccessModal
        visible={otp.showPlatformNotice}
        title="Account created — mobile app required"
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
