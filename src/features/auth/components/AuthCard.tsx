import { ActivityIndicator, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import AuthDivider from "@/components/landing/AuthDivider";
import AuthField from "@/components/landing/AuthField";
import AuthHeader from "@/components/landing/AuthHeader";
import SecurityNotice from "@/components/landing/SecurityNotice";
import { useLoginForm } from "../hooks/useLoginForm";
import AuthActionButton from "./AuthActionButton";
import AuthCardShell from "./AuthCardShell";
import { authCardMetrics } from "./authCardMetrics";
import { authCardStyles as styles } from "./authCardStyles";
import ForgotPasswordLink from "./ForgotPasswordLink";
import PlatformAccessModal from "./PlatformAccessModal";
import ForgotPasswordFlow from "../forgotPassword/ForgotPasswordFlow";

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

  const fieldProps = {
    labelSize: metrics.labelSize,
    labelGap: metrics.labelGap,
    height: metrics.fieldHeight,
    fontSize: metrics.fieldFontSize,
    disabled: form.isSubmitting,
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
          compact={isMobile || compact}
          headingSize={isMobile ? metrics.headingSize : undefined}
          subtitleSize={isMobile ? metrics.subtitleSize : undefined}
          gap={isMobile ? metrics.headerTextGap : undefined}
        />
      </View>

      <View style={[styles.form, { gap: metrics.fieldGap, marginBottom: metrics.formGap }]}>
        <AuthField
          {...fieldProps}
          label="Email or Phone Number"
          icon="mail-outline"
          placeholder="Enter your email or phone"
          value={form.email}
          onChangeText={form.setEmail}
          keyboardType="email-address"
          autoComplete="username"
          returnKeyType="next"
          error={form.emailError}
        />

        <AuthField
          {...fieldProps}
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter your password"
          value={form.password}
          onChangeText={form.setPassword}
          secureTextEntry
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={() => void form.submit()}
          error={form.passwordError}
        />
      </View>

      <AuthActionButton
        accessibilityLabel="Log In"
        onPress={() => void form.submit()}
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
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Logging In...</Text>
          </View>
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </AuthActionButton>

      <ForgotPasswordLink
        onPress={form.forgotPassword}
        marginBottom={metrics.afterForgotGap}
      />

      <View style={{ marginBottom: metrics.afterDividerGap }}>
        <AuthDivider />
      </View>

      <AuthActionButton
        accessibilityLabel="Create New Account"
        onPress={onOpenRegister}
        height={metrics.buttonHeight}
        marginBottom={metrics.afterCreateGap}
        backgroundColor={LANDING_COLORS.green}
        baseStyle={styles.createButton}
        trailingIcon="person-add-outline"
      >
        <Text style={styles.createButtonText}>Create New Account</Text>
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
