import { useCallback, useId } from "react";
import { Platform, Pressable, View } from "react-native";
import Modal from "@/components/ui/AppModal";

import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { residentDialogPalette, useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useReducedMotion } from "@/theme/motion";

import DialogFooter from "../DialogFooter";
import { DialogHeader } from "../DialogHeader";
import { ProminentDialogHeader } from "../ProminentDialogHeader";
import { DIALOG_BACKDROP_STYLE, buildDialogSurfaceStyle } from "../dialogModalStyle";
import type { DialogShellProps } from "./dialogShell.types";
import { DIALOG_ASIDE_WIDTH, DialogBody } from "./DialogSplitBody";
import { useShellScrollRequest } from "./useShellScrollRequest";

const LIGHT_PALETTE = residentDialogPalette(false);
const EDGE_PADDING = 16;

/** Centred dialog for desktop-width viewports, and for a phone turned sideways. */
export const DialogModalShell = ({
  visible,
  title,
  subtitle,
  icon,
  media,
  tint,
  tintSoft,
  onClose,
  children,
  footer,
  maxWidth = 560,
  radius,
  flush = false,
  lightSurface = false,
  onDismissRequest,
  headerVariant = "default",
  subheader,
  scrollToKey,
  scrollToY,
  aside,
  asideLabel = "",
  asideWidth = DIALOG_ASIDE_WIDTH,
}: DialogShellProps) => {
  const frame = useModalFrame(maxWidth);
  // A landscape phone is wide enough for this dialog but has a keyboard to clear.
  const layout = useSheetLayout({ enabled: visible, variant: "centered", edgePadding: EDGE_PADDING });
  const reducedMotion = useReducedMotion();
  const themedPalette = useResidentDialogPalette();
  const palette = lightSurface ? LIGHT_PALETTE : themedPalette;
  const titleId = useId();

  const handleDismiss = useCallback(() => {
    if (onDismissRequest?.()) return;
    onClose();
  }, [onDismissRequest, onClose]);

  useWebModalBehavior(visible, handleDismiss);
  const attachFocusTrap = useFocusTrap(visible);
  const scrollRef = useShellScrollRequest(scrollToKey, scrollToY);
  const Header = headerVariant === "prominent" ? ProminentDialogHeader : DialogHeader;

  if (!visible) return null;

  return (
    <Modal
      visible
      accessibilityLabel={title}
      transparent
      animationType={reducedMotion ? "none" : "fade"}
      onRequestClose={handleDismiss}
    >
      <SheetViewport layout={layout} style={DIALOG_BACKDROP_STYLE}>
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
            web: { role: "group", "aria-labelledby": titleId } as object,
          })}
          style={[
            buildDialogSurfaceStyle(palette, { ...frame, maxHeight: Math.min(frame.maxHeight, layout.maxHeight) }),
            radius === undefined ? null : { borderRadius: radius },
          ]}
        >
          <Header
            palette={palette}
            title={title}
            subtitle={subtitle}
            icon={icon}
            media={media}
            tint={tint}
            tintSoft={tintSoft}
            titleId={titleId}
            onClose={onClose}
          />

          {subheader}

          <DialogBody
            scrollRef={scrollRef}
            palette={palette}
            flush={flush}
            aside={aside}
            asideLabel={asideLabel}
            asideWidth={asideWidth}
          >
            {children}
          </DialogBody>

          {footer ? (
            <DialogFooter palette={palette} filled>
              {footer}
            </DialogFooter>
          ) : null}
        </View>
      </SheetViewport>
    </Modal>
  );
};
