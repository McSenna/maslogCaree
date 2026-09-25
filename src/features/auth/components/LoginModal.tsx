import { Feather } from "@expo/vector-icons";
import { Modal, ScrollView, Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import InlineAlert from "@/components/feedback/InlineAlert";
import TextField from "@/components/forms/TextField";
import BrandedDialogHeader from "@/components/ui/dialog/BrandedDialogHeader";
import { backDismissesKeyboardFirst } from "@/components/ui/sheetLayout/sheetBack";
import SheetViewport from "@/components/ui/sheetLayout/SheetViewport";
import { useSheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SHADOWS } from "@/theme/shadows";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

import PlatformAccessModal from "@/features/auth/components/PlatformAccessModal";
import ForgotPasswordFlow from "@/features/auth/forgotPassword/ForgotPasswordFlow";

import { useLoginForm } from "../hooks/useLoginForm";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
};

const CARD_EDGE = SPACING.lg;

const LoginModal = ({ visible, onClose, onOpenRegister }: LoginModalProps) => {
  const colors = useThemeColors();
  const form = useLoginForm({ onSuccess: onClose });
  const layout = useSheetLayout({ enabled: visible, variant: "centered", edgePadding: CARD_EDGE });
  const submit = () => void form.submit();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={backDismissesKeyboardFirst(layout, onClose)}>
      <SheetViewport layout={layout} style={{ backgroundColor: colors.overlay, paddingHorizontal: CARD_EDGE }}>
        <View
          style={[
            {
              width: "100%",
              maxWidth: 440,
              maxHeight: layout.maxHeight,
              overflow: "hidden",
              borderRadius: RADII.modal,
              backgroundColor: colors.surface,
            },
            SHADOWS.overlay,
          ]}
        >
          <BrandedDialogHeader
            icon="activity"
            eyebrow="Maslog Care"
            title="Welcome back"
            description="Sign in to access your digital barangay health services."
            closeLabel="Close login"
            onClose={onClose}
          />

          <ScrollView
            style={{ flexGrow: 0, flexShrink: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: SPACING.xl - 4, gap: SPACING.lg }}
          >
            <TextField
              label="Email or phone number"
              leftIcon="user"
              value={form.email}
              onChangeText={form.setEmail}
              placeholder="Enter your email or phone"
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="email-address"
              returnKeyType="next"
              disabled={form.isSubmitting}
              error={form.emailError}
            />

            <TextField
              label="Password"
              leftIcon="lock"
              value={form.password}
              onChangeText={form.setPassword}
              placeholder="Enter your password"
              autoComplete="current-password"
              secureToggle
              returnKeyType="go"
              onSubmitEditing={submit}
              disabled={form.isSubmitting}
              error={form.passwordError}
            />

            {form.formError ? <InlineAlert title={form.formError.title} message={form.formError.message} /> : null}

            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <Button variant="text" size="sm" label="Forgot password?" onPress={form.forgotPassword} />
              {onOpenRegister ? (
                <Button
                  variant="text"
                  size="sm"
                  label="Register now"
                  icon="arrow-right"
                  iconPosition="right"
                  onPress={() => {
                    onClose();
                    onOpenRegister();
                  }}
                />
              ) : null}
            </View>

            <Button
              label="Log in"
              loadingLabel="Logging in…"
              icon="log-in"
              size="lg"
              fullWidth
              loading={form.isSubmitting}
              onPress={submit}
            />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.xs + 2 }}>
              <Feather name="lock" size={12} color={colors.subtle} />
              <Text style={[TYPE.caption, { color: colors.muted }]}>Secure login for Barangay Maslog residents</Text>
            </View>
          </ScrollView>
        </View>
      </SheetViewport>

      <PlatformAccessModal visible={form.showPlatformNotice} onClose={form.dismissPlatformNotice} />

      <ForgotPasswordFlow visible={form.showForgotPassword} onClose={form.closeForgotPassword} initialEmail={form.email} />
    </Modal>
  );
};

export default LoginModal;
