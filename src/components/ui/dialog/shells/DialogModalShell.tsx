import { useCallback, useId } from "react";
import { Modal, Platform, Pressable, ScrollView, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import DialogFooter from "../DialogFooter";
import { DialogHeader } from "../DialogHeader";
import {
  DIALOG_BACKDROP_STYLE,
  DIALOG_CONTENT_PADDING,
  buildDialogSurfaceStyle,
} from "../dialogModalStyle";
import type { DialogShellProps } from "./dialogShell.types";

/** Centred dialog for desktop-width viewports. */
export const DialogModalShell = ({
  visible,
  title,
  icon,
  tint,
  tintSoft,
  onClose,
  children,
  footer,
  maxWidth = 560,
  onDismissRequest,
}: DialogShellProps) => {
  const frame = useModalFrame(maxWidth);
  const palette = useResidentDialogPalette();
  const titleId = useId();

  const handleDismiss = useCallback(() => {
    if (onDismissRequest?.()) return;
    onClose();
  }, [onDismissRequest, onClose]);

  useWebModalBehavior(visible, handleDismiss);
  const attachFocusTrap = useFocusTrap(visible);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={DIALOG_BACKDROP_STYLE}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${title}`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          {...Platform.select({
            web: { role: "dialog", "aria-modal": true, "aria-labelledby": titleId } as object,
          })}
          style={buildDialogSurfaceStyle(palette, frame)}
        >
          <DialogHeader
            palette={palette}
            title={title}
            icon={icon}
            tint={tint}
            tintSoft={tintSoft}
            titleId={titleId}
            onClose={onClose}
          />

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ padding: DIALOG_CONTENT_PADDING, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {footer ? (
            <DialogFooter palette={palette} filled>
              {footer}
            </DialogFooter>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
