import { useRef } from "react";
import { ActivityIndicator, Text, View, type TextInput } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import AuthDivider from "@/components/landing/AuthDivider";
import AuthHeader from "@/components/landing/AuthHeader";
import SecurityNotice from "@/components/landing/SecurityNotice";
import { useLoginForm } from "../hooks/useLoginForm";
import AuthActionButton from "./AuthActionButton";
import AuthCardFields from "./AuthCardFields";
import AuthCardShell from "./AuthCardShell";
import { authCardMetrics } from "./authCardMetrics";
import { authCardStyles as styles } from "./authCardStyles";
import ForgotPasswordLink from "./ForgotPasswordLink";
import PlatformAccessModal from "./PlatformAccessModal";
import ForgotPasswordFlow from "../forgotPassword/ForgotPasswordFlow";
import { PALETTE } from "@/theme/palette";

type AuthCardProps = {
  onOpenRegister?: () => void;
  isMobile?: boolean;
  compact?: boolean;
  density?: number;
  entranceDelay?: number;
};

const AuthCard = ({
  onOpenRegister,
  isMobile = false,
  compact = false,
  density = 1,
  entranceDelay = 0,
}: AuthCardProps) => {
  const form = useLoginForm();
  const metrics = authCardMetrics(isMobile, density);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const submit = async () => {
    const invalidField = await form.submit();
    if (invalidField === "email") emailRef.current?.focus();
    if (invalidField === "password") passwordRef.current?.focus();
  };

  return (
    <AuthCardShell
      isMobile={isMobile}
      compact={compact}
      metrics={metrics}
      entranceDelay={entranceDelay}
    >
      <View style={{ marginBottom: metrics.headerGap }}>
        <AuthHeader
          centered={isMobile}
          headingSize={metrics.headingSize}
          subtitleSize={metrics.subtitleSize}
          gap={metrics.headerTextGap}
          eyebrowGap={metrics.eyebrowGap}
        />
      </View>

      <AuthCardFields
        form={form}
        metrics={metrics}
        emailRef={emailRef}
        passwordRef={passwordRef}
        onSubmit={() => void submit()}
      />

      <AuthActionButton
        accessibilityLabel="Log in"
        onPress={() => void submit()}
        disabled={form.isSubmitting}
        forcePressed={form.isSubmitting}
        height={metrics.buttonHeight}
        marginBottom={metrics.afterLoginGap}
        backgroundColor={LANDING_COLORS.primaryBlue}
        baseStyle={styles.loginButton}
        trailingIcon={form.isSubmitting ? undefined : "arrow-forward"}
      >
        {form.isSubmitting ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={PALETTE.white} />
            <Text style={styles.loginButtonText}>Logging in…</Text>
          </View>
        ) : (
          <Text style={styles.loginButtonText}>Log in</Text>
        )}
      </AuthActionButton>

      <ForgotPasswordLink
        onPress={form.forgotPassword}
        disabled={form.isSubmitting}
        marginBottom={metrics.afterForgotGap}
      />

      <View style={{ marginBottom: metrics.afterDividerGap }}>
        <AuthDivider />
      </View>

      <AuthActionButton
        accessibilityLabel="Create an account"
        onPress={onOpenRegister}
        disabled={form.isSubmitting}
        height={metrics.buttonHeight}
        marginBottom={metrics.afterCreateGap}
        backgroundColor={LANDING_COLORS.green}
        baseStyle={styles.createButton}
        trailingIcon="person-add-outline"
      >
        <Text style={styles.createButtonText}>Create an account</Text>
      </AuthActionButton>

      <View style={styles.securityWrapper}>
        <SecurityNotice />
      </View>

      <PlatformAccessModal
        visible={form.showPlatformNotice}
        onClose={form.dismissPlatformNotice}
      />

      <ForgotPasswordFlow
        visible={form.showForgotPassword}
        onClose={form.closeForgotPassword}
        initialEmail={form.email}
      />
    </AuthCardShell>
  );
};

export default AuthCard;
