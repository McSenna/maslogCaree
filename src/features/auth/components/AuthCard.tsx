import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import AuthDivider from "@/components/landing/AuthDivider";
import AuthHeader from "@/components/landing/AuthHeader";
import AuthInput from "@/components/landing/AuthInput";
import SecurityNotice from "@/components/landing/SecurityNotice";
import { useLoginForm } from "../hooks/useLoginForm";
import AuthActionButton from "./AuthActionButton";
import { authCardMetrics } from "./authCardMetrics";
import { authCardStyles as styles } from "./authCardStyles";
import PlatformAccessModal from "./PlatformAccessModal";

type AuthCardProps = {
  /** Called when the user taps "Create New Account". */
  onOpenRegister?: () => void;
  /** Whether to use the mobile-optimised layout. */
  isMobile?: boolean;
  /** Reduced desktop scale for short or narrow viewports (e.g. 1366x768). */
  compact?: boolean;
};

/**
 * The sign-in card on the landing page.
 *
 * The same card at three scales — full desktop, compact desktop and mobile —
 * chosen by the caller rather than measured here, because the landing page
 * already knows which of its two layouts it is drawing.
 */
export default function AuthCard({
  onOpenRegister,
  isMobile = false,
  compact = false,
}: AuthCardProps) {
  const form = useLoginForm();
  const metrics = authCardMetrics(isMobile, compact);

  return (
    <View
      style={[
        styles.card,
        isMobile ? styles.cardMobile : compact ? styles.cardDesktopCompact : styles.cardDesktop,
      ]}
    >
      <View style={{ marginBottom: metrics.headerGap }}>
        <AuthHeader centered={isMobile} compact={isMobile || compact} />
      </View>

      <View style={[styles.form, { gap: metrics.fieldGap, marginBottom: metrics.formGap }]}>
        <AuthInput
          icon="mail-outline"
          placeholder="Email address or phone number"
          value={form.email}
          onChangeText={form.setEmail}
          keyboardType="email-address"
          accessibilityLabel="Email address or phone number"
          height={metrics.fieldHeight}
          fontSize={metrics.fieldFontSize}
        />

        <AuthInput
          icon="lock-closed-outline"
          placeholder="Password"
          value={form.password}
          onChangeText={form.setPassword}
          secureTextEntry
          accessibilityLabel="Password"
          height={metrics.fieldHeight}
          fontSize={metrics.fieldFontSize}
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

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Forgotten password"
        onPress={form.forgotPassword}
        style={[styles.forgotContainer, { marginBottom: metrics.afterForgotGap }]}
      >
        <Text style={styles.forgotText}>Forgotten password?</Text>
      </Pressable>

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
    </View>
  );
}
