import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { SHEET_KEYBOARD_DISMISS_MODE } from "@/components/ui/sheetLayout/sheetScroll";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import DateOfBirthPicker from "../components/datePicker/DateOfBirthPicker";
import OtpVerificationModal from "../components/OtpVerificationModal";
import RegistrationSuccess from "./components/RegistrationSuccess";
import EmailVerificationModal from "./components/email/EmailVerificationModal";
import DialogFooter from "./dialog/DialogFooter";
import DialogHeader from "./dialog/DialogHeader";
import StepBody from "./dialog/StepBody";
import { DatePickerHostProvider, type DatePickerRequest } from "./dialog/datePickerHost";
import { DESKTOP_EDGE, dialogBackdropStyle, dialogSurfaceStyle } from "./dialog/dialogSurface";
import { useDialogDismiss } from "./dialog/useDialogDismiss";
import { REG_METRICS } from "./registrationTheme";
import { useResidentRegistration } from "./useResidentRegistration";
import type { StepLayout } from "./steps/stepLayout";
import { useResponsive } from "@/hooks/useResponsive";

const TWO_COLUMN_BREAKPOINT = 640;

type ResidentRegistrationDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const ResidentRegistrationDialog = ({
  visible,
  onClose,
}: ResidentRegistrationDialogProps) => {
  const { width, isMobile } = useResponsive();
  const isSheet = isMobile;
  // Safe area, keyboard and height limits for the sheet (see useSheetLayout).
  const sheetLayout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.94 : 0.92,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

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
        onRequestClose={backDismissesKeyboardFirst(sheetLayout, requestClose)}
        statusBarTranslucent
      >
        <SheetViewport layout={sheetLayout} style={dialogBackdropStyle(isSheet)}>
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
              ...dialogSurfaceStyle(isSheet, sheetLayout),
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
              keyboardDismissMode={SHEET_KEYBOARD_DISMISS_MODE}
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
        </SheetViewport>
      </Modal>

      <DateOfBirthPicker
        visible={visible && dateRequest !== null}
        value={dateRequest?.value ?? ""}
        onConfirm={(isoDate) => dateRequest?.onConfirm(isoDate)}
        onClose={closeDatePicker}
      />

      <EmailVerificationModal
        visible={visible && form.emailVerification.isCodeDialogOpen}
        email={form.values.email}
        verification={form.emailVerification}
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
