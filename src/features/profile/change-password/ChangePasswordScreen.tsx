import { useId } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import Modal from "@/components/ui/AppModal";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useReducedMotion } from "@/theme/motion";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

import { ChangePasswordActions } from "./ChangePasswordActions";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings";
import { dialogLabelProps } from "./dialogLabelProps";
import type { ChangePasswordFlow } from "./useChangePasswordFlow";

type ChangePasswordScreenProps = {
  visible: boolean;
  flow: ChangePasswordFlow;
};

const IS_WEB = Platform.OS === "web";

/**
 * Full screen for phones: the app, and web under the tablet breakpoint. Labels
 * sit above the inputs and the main action stays pinned above the keyboard.
 */
export const ChangePasswordScreen = ({ visible, flow }: ChangePasswordScreenProps) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const subtitleId = useId();
  // Reserves the status bar above and the keyboard below, so the footer rides on the keys.
  const layout = useSheetLayout({ enabled: visible, variant: "sheet" });

  useWebModalBehavior(visible, flow.requestClose);
  const attachFocusTrap = useFocusTrap(visible);

  if (!visible) return null;

  return (
    <Modal
      visible
      animationType={reducedMotion ? "none" : "slide"}
      presentationStyle="fullScreen"
      onRequestClose={IS_WEB ? undefined : flow.requestClose}
      {...dialogLabelProps(titleId, subtitleId, S.title)}
    >
      <SheetViewport layout={layout} style={{ backgroundColor: colors.surface }}>
        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          className="w-full flex-1"
          style={{ paddingLeft: insets.left, paddingRight: insets.right }}
        >
          <View
            className="flex-row items-center"
            style={{ justifyContent: IS_WEB ? "flex-end" : "flex-start", paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs }}
          >
            {IS_WEB ? (
              <IconButton icon="x" label={S.close} size={44} onPress={flow.requestClose} disabled={flow.isSubmitting} showTooltip={false} />
            ) : (
              <Button variant="ghost" label={S.cancel} onPress={flow.requestClose} disabled={flow.isSubmitting} />
            )}
          </View>

          <View
            style={{
              gap: SPACING.xs,
              paddingHorizontal: SPACING.lg,
              paddingBottom: SPACING.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            }}
          >
            <Text nativeID={titleId} accessibilityRole="header" style={[TYPE.headline, { color: colors.heading }]}>
              {S.title}
            </Text>
            <Text nativeID={subtitleId} style={[TYPE.body, { color: colors.muted }]}>
              {S.subtitle}
            </Text>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: SPACING.lg }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
          >
            <ChangePasswordForm flow={flow} layout="stacked" />
          </ScrollView>

          <View
            style={{
              paddingHorizontal: SPACING.lg,
              paddingTop: SPACING.md,
              paddingBottom: SPACING.md + layout.bottomInset,
              borderTopWidth: 1,
              borderTopColor: colors.divider,
            }}
          >
            <ChangePasswordActions
              stacked
              showCancel={IS_WEB}
              isSubmitting={flow.isSubmitting}
              onSubmit={flow.submit}
              onCancel={flow.requestClose}
            />
          </View>
        </View>
      </SheetViewport>
    </Modal>
  );
};

export default ChangePasswordScreen;
