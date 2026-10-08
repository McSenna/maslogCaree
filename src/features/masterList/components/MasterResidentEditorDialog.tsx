import { useCallback, useMemo, useState } from "react";
import { Animated, Pressable, ScrollView } from "react-native";

import { toast } from "@/components/feedback";
import Modal from "@/components/ui/AppModal";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { SHEET_KEYBOARD_DISMISS_MODE } from "@/components/ui/sheetLayout/sheetScroll";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import { DatePickerHostProvider, type DatePickerRequest } from "@/features/auth/registration/dialog/datePickerHost";
import {
  DESKTOP_EDGE,
  dialogBackdropStyle,
  dialogSurfaceStyle,
} from "@/features/auth/registration/dialog/dialogSurface";
import { useDialogDismiss } from "@/features/auth/registration/dialog/useDialogDismiss";
import { REG_METRICS } from "@/features/auth/registration/registrationTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import { useMasterResidentEditor } from "../hooks/useMasterResidentEditor";
import type { MasterResidentRecord } from "../masterList.types";
import MasterEditorBody from "./editor/MasterEditorBody";
import MasterEditorFooter from "./editor/MasterEditorFooter";
import MasterEditorHeader from "./editor/MasterEditorHeader";

const TWO_COLUMN_BREAKPOINT = 640;

type Props = {
  editing: MasterResidentRecord | null;
  onClose: () => void;
  onSaved: () => void;
};

/**
 * Add or edit a master list record in the resident registration dialog's
 * design: a centred card on wide screens, a bottom sheet on phones, the same
 * header, step tracker, fields and footer. Mounted only while open, so each
 * opening starts from the record it was opened for.
 */
const MasterResidentEditorDialog = ({ editing, onClose, onSaved }: Props) => {
  const { width, isMobile: isSheet } = useResponsive();
  const sheetLayout = useSheetLayout({
    enabled: true,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.94 : 0.92,
    edgePadding: isSheet ? 0 : DESKTOP_EDGE,
  });

  const handleSaved = useCallback(
    (saved: MasterResidentRecord) => {
      toast.success(editing ? "Record updated" : "Record added", `Master resident ID ${saved.masterResidentId}`);
      onSaved();
      onClose();
    },
    [editing, onClose, onSaved]
  );
  const form = useMasterResidentEditor({ editing, onSaved: handleSaved });

  // Held outside the `Modal` element so an Android dialog recreation cannot
  // reset it (see auth/registration/dialog/datePickerHost).
  const [dateRequest, setDateRequest] = useState<DatePickerRequest | null>(null);
  const datePickerHost = useMemo(() => ({ open: (request: DatePickerRequest) => setDateRequest(request) }), []);

  const { dragY, dragHandlers, requestClose } = useDialogDismiss({
    onClose,
    isSubmitting: form.submitting,
    isSucceeded: false,
    hasUnsavedInput: form.hasUnsavedInput,
    discardTitle: editing ? "Discard your changes?" : "Discard this record?",
    discardMessage: "The details you have entered will not be saved.",
  });
  useWebModalBehavior(true, requestClose);
  const attachFocusTrap = useFocusTrap(true);

  const horizontalPadding = isSheet ? 20 : 32;
  const inputHeight = isSheet ? REG_METRICS.sheetInputHeight : REG_METRICS.modalInputHeight;
  const buttonHeight = isSheet ? REG_METRICS.buttonHeight.sheet : REG_METRICS.buttonHeight.modal;

  return (
    <>
      <Modal
        visible
        transparent
        animationType={isSheet ? "slide" : "fade"}
        onRequestClose={backDismissesKeyboardFirst(sheetLayout, requestClose)}
        statusBarTranslucent
      >
        <SheetViewport layout={sheetLayout} style={dialogBackdropStyle(isSheet)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close the master list record"
            onPress={requestClose}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />
          <Animated.View
            ref={attachFocusTrap as never}
            accessibilityViewIsModal
            style={{ ...dialogSurfaceStyle(isSheet, sheetLayout), transform: [{ translateY: dragY }] }}
          >
            <MasterEditorHeader
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
              contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingTop: 20, paddingBottom: 20 }}
            >
              <DatePickerHostProvider value={datePickerHost}>
                <MasterEditorBody form={form} inputHeight={inputHeight} twoColumn={width >= TWO_COLUMN_BREAKPOINT} />
              </DatePickerHostProvider>
            </ScrollView>
            <MasterEditorFooter
              form={form}
              isSheet={isSheet}
              horizontalPadding={horizontalPadding}
              buttonHeight={buttonHeight}
            />
          </Animated.View>
        </SheetViewport>
      </Modal>

      <DateOfBirthPicker
        visible={dateRequest !== null}
        value={dateRequest?.value ?? ""}
        onConfirm={(isoDate) => dateRequest?.onConfirm(isoDate)}
        onClose={() => setDateRequest(null)}
      />
    </>
  );
};

export default MasterResidentEditorDialog;
