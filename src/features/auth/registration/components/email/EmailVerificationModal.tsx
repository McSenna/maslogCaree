import { useCallback, useEffect, useId, useRef } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useReducedMotion } from "@/theme/motion";
import { useDialogEnter } from "@/hooks/useDialogEnter";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import type { useEmailVerification } from "../../hooks/useEmailVerification";
import { REG_COLORS, REG_METRICS, REG_RADIUS } from "../../registrationTheme";
import VerificationCodeBlock from "./VerificationCodeBlock";

type EmailVerificationModalProps = {
  visible: boolean;
  email: string;
  verification: ReturnType<typeof useEmailVerification>;
};

/** Below this width the dialog becomes a bottom sheet, which leaves room for 44px code boxes. */
const SHEET_BREAKPOINT = 480;
const CARD_MAX_WIDTH = 440;
const CARD_EDGE = 24;

/**
 * The e-mail code step of registration, shown over the registration dialog once
 * a code has been sent. Rendered beside that dialog rather than inside it (like
 * the date picker) so an Android dialog recreation cannot reset it.
 */
const EmailVerificationModal = ({ visible, email, verification }: EmailVerificationModalProps) => {
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const titleId = useId();

  const isSheet = width < SHEET_BREAKPOINT;
  const layout = useSheetLayout({
    enabled: visible,
    variant: isSheet ? "sheet" : "centered",
    maxHeightRatio: isSheet ? 0.94 : 0.92,
    edgePadding: isSheet ? 0 : CARD_EDGE,
  });
  const close = verification.closeCodeDialog;

  // react-native-web only makes a modal the active one (the one whose focus trap
  // runs) when its open animation ends. Until then the registration dialog
  // underneath kept trapping focus and pulled it out of the code boxes, so fast
  // typing or autofill in the first ~250ms went nowhere. On web the Modal opens
  // instantly and this component animates its own card instead.
  const isWeb = Platform.OS === "web";
  const enter = useDialogEnter(visible && isWeb && !reducedMotion);
  const modalAnimation = isWeb || reducedMotion ? "none" : isSheet ? "slide" : "fade";
  const webEnterStyle =
    isWeb && !reducedMotion
      ? {
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [isSheet ? 24 : 8, 0] }) },
          ],
        }
      : null;

  useWebModalBehavior(visible, close);
  const attachFocusTrap = useFocusTrap(visible);

  const surfaceRef = useRef<unknown>(null);
  const attachSurface = useCallback(
    (node: unknown) => {
      surfaceRef.current = node;
      attachFocusTrap(node);
    },
    [attachFocusTrap]
  );

  // react-native-web's Modal already renders the role="dialog" aria-modal element
  // but leaves it unnamed; name it after the visible heading instead of nesting a
  // second dialog inside it.
  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    const node = surfaceRef.current as HTMLElement | null;
    node?.closest?.('[aria-modal="true"]')?.setAttribute("aria-labelledby", titleId);
  }, [visible, titleId]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={modalAnimation}
      onRequestClose={backDismissesKeyboardFirst(layout, close)}
      statusBarTranslucent
    >
      <SheetViewport
        layout={layout}
        style={{ backgroundColor: REG_COLORS.overlay, paddingHorizontal: isSheet ? 0 : CARD_EDGE }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close email verification"
          focusable={false}
          onPress={close}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <Animated.View
          ref={attachSurface as never}
          accessibilityViewIsModal
          style={{
            ...webEnterStyle,
            width: "100%",
            maxWidth: isSheet ? undefined : CARD_MAX_WIDTH,
            maxHeight: layout.maxHeight,
            backgroundColor: REG_COLORS.surface,
            borderTopLeftRadius: isSheet ? REG_RADIUS.sheet : REG_RADIUS.modal,
            borderTopRightRadius: isSheet ? REG_RADIUS.sheet : REG_RADIUS.modal,
            borderBottomLeftRadius: isSheet ? 0 : REG_RADIUS.modal,
            borderBottomRightRadius: isSheet ? 0 : REG_RADIUS.modal,
            borderWidth: isSheet ? 0 : 1,
            borderColor: REG_COLORS.border,
            overflow: "hidden",
            boxShadow: "0px 18px 48px rgba(8, 21, 47, 0.22)",
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={close}
            style={({ pressed, hovered }) => ({
              position: "absolute",
              top: isSheet ? 8 : 12,
              right: isSheet ? 8 : 12,
              zIndex: 1,
              width: REG_METRICS.touchTarget,
              height: REG_METRICS.touchTarget,
              borderRadius: REG_RADIUS.pill,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed || hovered ? REG_COLORS.surfaceMuted : "transparent",
            })}
          >
            <Feather name="x" size={20} color={REG_COLORS.muted} />
          </Pressable>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 0, flexShrink: 1 }}
            contentContainerStyle={{
              paddingHorizontal: isSheet ? 20 : 28,
              paddingTop: isSheet ? 20 : 28,
              paddingBottom: (isSheet ? 20 : 28) + (isSheet ? layout.bottomInset : 0),
            }}
          >
            <VerificationCodeBlock
              email={email}
              verification={verification}
              onChangeEmail={verification.changeEmail}
              onDone={close}
              buttonHeight={isSheet ? REG_METRICS.buttonHeight.sheet : REG_METRICS.buttonHeight.modal}
              titleId={titleId}
            />
          </ScrollView>
        </Animated.View>
      </SheetViewport>
    </Modal>
  );
};

export default EmailVerificationModal;
