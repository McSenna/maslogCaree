import { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForgotPassword, type ForgotPasswordController } from "./useForgotPassword";
import StepIndicator from "./components/StepIndicator";
import FlowHeader from "./flow/FlowHeader";
import FlowShell from "./flow/FlowShell";
import {
  EmailSentStep,
  EmailStep,
  OtpStep,
  ResetPasswordStep,
  SuccessStep,
} from "./components/RecoverySteps";

const SHEET_BREAKPOINT = 768;

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
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [flow.step, fade]);

  return (
    <Animated.View style={{ width: "100%", opacity: fade }}>
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
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSheet = width < SHEET_BREAKPOINT;

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
    <FlowShell visible={visible} isSheet={isSheet} insets={insets} onRequestClose={requestClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ gap: 18, paddingBottom: 4 }}
      >
        <FlowHeader
          canGoBack={canGoBack}
          dismissible={dismissible}
          onBack={flow.changeEmail}
          onClose={requestClose}
        />
        {flow.step !== "success" ? <StepIndicator step={flow.step} compact={isSheet} /> : null}
        <StepTransition flow={flow} />
      </ScrollView>
    </FlowShell>
  );
};

export default ForgotPasswordFlow;
