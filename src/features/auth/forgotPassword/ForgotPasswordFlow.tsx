import { useEffect } from "react";
import { Animated, ScrollView } from "react-native";
import { useForgotPassword, type ForgotPasswordController } from "./useForgotPassword";
import StepIndicator from "./components/StepIndicator";
import FlowHeader from "./flow/FlowHeader";
import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { SHEET_KEYBOARD_DISMISS_MODE } from "@/components/ui/sheetLayout/sheetScroll";
import FlowShell from "./flow/FlowShell";
import {
  EmailSentStep,
  EmailStep,
  OtpStep,
  ResetPasswordStep,
  SuccessStep,
} from "./components/RecoverySteps";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useResponsive } from "@/hooks/useResponsive";


const StepBody = ({ flow }: { flow: ForgotPasswordController }) => {
  switch (flow.step) {
    case "email":
      return <EmailStep flow={flow} />;
    case "sent":
      return <EmailSentStep flow={flow} />;
    case "otp":
      return <OtpStep flow={flow} />;
    case "password":
      return <ResetPasswordStep flow={flow} />;
    case "success":
      return <SuccessStep flow={flow} />;
  }
};

const StepTransition = ({ flow }: { flow: ForgotPasswordController }) => {
  const fade = useAnimatedValue(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: TIMING.enter,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [flow.step, fade, reducedMotion]);

  return (
    <Animated.View
      style={{
        width: "100%",
        opacity: fade,
        transform: [{ translateX: fade.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 10, 0] }) }],
      }}
    >
      <StepBody flow={flow} />
    </Animated.View>
  );
};

const ForgotPasswordFlow = ({
  visible,
  onClose,
  initialEmail,
}: {
  visible: boolean;
  onClose: () => void;
  initialEmail?: string;
}) => {
  const { isMobile } = useResponsive();
  const isSheet = isMobile;

  const flow = useForgotPassword({ onExit: onClose });
  const { reset, setEmail } = flow;

  useEffect(() => {
    if (!visible) return;
    reset();
    if (initialEmail?.trim()) setEmail(initialEmail.trim());
  }, [visible, reset, setEmail, initialEmail]);

  const dismissible = !flow.isLoading;
  const requestClose = () => {
    if (dismissible) flow.close();
  };

  const canGoBack = flow.step === "sent" || flow.step === "otp";

  return (
    <FlowShell
      visible={visible}
      isSheet={isSheet}
      onRequestClose={requestClose}
      header={
        <FlowHeader
          canGoBack={canGoBack}
          dismissible={dismissible}
          onBack={flow.changeEmail}
          onClose={requestClose}
        />
      }
    >
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={SHEET_KEYBOARD_DISMISS_MODE}
        contentContainerStyle={{ gap: 18, paddingTop: 18, paddingBottom: 4 }}
      >
        {flow.step !== "success" ? <StepIndicator step={flow.step} compact={isSheet} /> : null}
        <StepTransition flow={flow} />
      </ScrollView>
    </FlowShell>
  );
};

export default ForgotPasswordFlow;
