import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import DateOfBirthPicker from "../components/datePicker/DateOfBirthPicker";
import OtpVerificationModal from "../components/OtpVerificationModal";
import RegistrationSuccess from "./components/RegistrationSuccess";
import DialogFooter from "./dialog/DialogFooter";
import DialogHeader from "./dialog/DialogHeader";
import StepBody from "./dialog/StepBody";
import { DatePickerHostProvider, type DatePickerRequest } from "./dialog/datePickerHost";
import { dialogBackdropStyle, dialogSurfaceStyle } from "./dialog/dialogSurface";
import { useDialogDismiss } from "./dialog/useDialogDismiss";
import { REG_METRICS } from "./registrationTheme";
import { useResidentRegistration } from "./useResidentRegistration";
import type { StepLayout } from "./steps/stepLayout";

const SHEET_BREAKPOINT = 768;
const TWO_COLUMN_BREAKPOINT = 640;

type ResidentRegistrationDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const ResidentRegistrationDialog = ({
  visible,
  onClose,
}: ResidentRegistrationDialogProps) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // KeyboardAvoidingView does nothing inside a statusBarTranslucent modal on
  // Android, which left the keyboard sitting over the step's inputs.
  const keyboardInset = useKeyboardInset(visible);
  const isSheet = width < SHEET_BREAKPOINT;
  const availableHeight = isSheet ? height - keyboardInset - insets.top : height;

  const form = useResidentRegistration(onClose);
  const { reset, hasUnsavedInput, isSubmitting, isSucceeded } = form;

  useEffect(() => {
    if (visible) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Held here, outside the `Modal` element, so an Android dialog recreation
  // cannot reset it and close the picker (see ./dialog/datePickerHost).
  const [dateRequest, setDateRequest] = useState<DatePickerRequest | null>(null);
  const closeDatePicker = useCallback(() => setDateRequest(null), []);
  const datePickerHost = useMemo(
    () => ({ open: (request: DatePickerRequest) => setDateRequest(request) }),
    []
  );

  const { dragY, dragHandlers, requestClose } = useDialogDismiss({
    onClose,
    isSubmitting,
    isSucceeded,
    hasUnsavedInput,
  });

  useWebModalBehavior(visible, requestClose);
  const attachFocusTrap = useFocusTrap(visible);

  const layout: StepLayout = {
    inputHeight: isSheet ? REG_METRICS.sheetInputHeight : REG_METRICS.modalInputHeight,
    twoColumn: width >= TWO_COLUMN_BREAKPOINT,
  };
  const buttonHeight = isSheet ? REG_METRICS.buttonHeight.sheet : REG_METRICS.buttonHeight.modal;
  const horizontalPadding = isSheet ? 20 : 32;

  const onPrimaryPress = () => {
    if (form.isLastStep) void form.submit();
    else form.goNext();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType={isSheet ? "slide" : "fade"}
        onRequestClose={requestClose}
        statusBarTranslucent
      >
        <View style={dialogBackdropStyle(isSheet)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close registration"
            onPress={requestClose}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <Animated.View
            ref={attachFocusTrap as never}
            accessibilityViewIsModal
            style={{
              ...dialogSurfaceStyle(isSheet, availableHeight),
              marginBottom: isSheet ? keyboardInset : 0,
              transform: [{ translateY: dragY }],
            }}
          >
            <DialogHeader
              form={form}
              isSheet={isSheet}
              horizontalPadding={horizontalPadding}
              onClose={requestClose}
              dragHandlers={dragHandlers}
            />

            <ScrollView
              style={{ flexGrow: 1, flexShrink: 1 }}
              showsVerticalScrollIndicator={!isSheet}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{
                paddingHorizontal: horizontalPadding,
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              {isSucceeded ? (
                <RegistrationSuccess
                  email={form.registeredEmail}
                  onContinue={form.finish}
                  height={buttonHeight}
                />
              ) : (
                <DatePickerHostProvider value={datePickerHost}>
                  <StepBody form={form} layout={layout} />
                </DatePickerHostProvider>
              )}
            </ScrollView>

            {!isSucceeded ? (
              <DialogFooter
                form={form}
                isSheet={isSheet}
                horizontalPadding={horizontalPadding}
                buttonHeight={buttonHeight}
                onPrimaryPress={onPrimaryPress}
              />
            ) : null}
          </Animated.View>
        </View>
      </Modal>

      <DateOfBirthPicker
        visible={visible && dateRequest !== null}
        value={dateRequest?.value ?? ""}
        onConfirm={(isoDate) => dateRequest?.onConfirm(isoDate)}
        onClose={closeDatePicker}
      />

      <OtpVerificationModal
        visible={visible && form.showOtpModal}
        email={form.registeredEmail}
        onVerified={form.finish}
        onClose={form.closeOtpModal}
      />
    </>
  );
};

export default ResidentRegistrationDialog;
