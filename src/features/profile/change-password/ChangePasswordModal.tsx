import { useId } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

import IconButton from "@/components/buttons/IconButton";
import Modal from "@/components/ui/AppModal";
import { useModalFrame } from "@/hooks/useModalFrame";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useReducedMotion } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SHADOWS } from "@/theme/shadows";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { ChangePasswordActions } from "./ChangePasswordActions";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings";
import { dialogLabelProps } from "./dialogLabelProps";
import type { ChangePasswordFlow } from "./useChangePasswordFlow";

type ChangePasswordModalProps = {
  visible: boolean;
  flow: ChangePasswordFlow;
};

const MODAL_WIDTH = 800;
const BACKDROP_BLUR = Platform.OS === "web" ? ({ backdropFilter: "blur(4px)" } as object) : null;
const BACKDROP_CURSOR = webStyle({ cursor: "default" });

/** The centred dialog for tablet and desktop web: labels beside the inputs, as in the mockup. */
export const ChangePasswordModal = ({ visible, flow }: ChangePasswordModalProps) => {
  const colors = useThemeColors();
  const frame = useModalFrame(MODAL_WIDTH);
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const subtitleId = useId();

  useWebModalBehavior(visible, flow.requestClose);
  const attachFocusTrap = useFocusTrap(visible);

  if (!visible) return null;

  return (
    <Modal
      visible
      transparent
      animationType={reducedMotion ? "none" : "fade"}
      // Web closes on Escape through useWebModalBehavior; RN-web's own keyup close would run it twice.
      onRequestClose={Platform.OS === "web" ? undefined : flow.requestClose}
      {...dialogLabelProps(titleId, subtitleId, S.title)}
    >
      <View
        className="flex-1 items-center justify-center p-4"
        style={[{ backgroundColor: colors.overlay }, BACKDROP_BLUR]}
      >
        {/* A pointer shortcut only: keyboard and screen reader users have Escape and the × button. */}
        <Pressable
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          tabIndex={-1}
          onPress={flow.requestClose}
          className="absolute inset-0"
          style={BACKDROP_CURSOR}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          style={{
            width: frame.width,
            maxHeight: frame.maxHeight,
            borderRadius: RADII.large,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            overflow: "hidden",
            ...SHADOWS.overlay,
          }}
        >
          <View
            className="flex-row items-start justify-between"
            style={{
              gap: SPACING.lg,
              paddingHorizontal: SPACING.xxl,
              paddingTop: SPACING.xl,
              paddingBottom: SPACING.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            }}
          >
            <View className="min-w-0 flex-1" style={{ gap: SPACING.xs }}>
              <Text nativeID={titleId} accessibilityRole="header" style={[TYPE.headline, { color: colors.heading }]}>
                {S.title}
              </Text>
              <Text nativeID={subtitleId} style={[TYPE.bodyLarge, { color: colors.muted }]}>
                {S.subtitle}
              </Text>
            </View>
            <IconButton icon="x" label={S.close} size={44} onPress={flow.requestClose} disabled={flow.isSubmitting} showTooltip={false} />
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.xl }}
            keyboardShouldPersistTaps="handled"
          >
            <ChangePasswordForm flow={flow} layout="row" />
          </ScrollView>

          <View
            style={{
              paddingHorizontal: SPACING.xxl,
              paddingVertical: SPACING.lg,
              borderTopWidth: 1,
              borderTopColor: colors.divider,
            }}
          >
            <ChangePasswordActions
              stacked={false}
              showCancel
              isSubmitting={flow.isSubmitting}
              onSubmit={flow.submit}
              onCancel={flow.requestClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;
