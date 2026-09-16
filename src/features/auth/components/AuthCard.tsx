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
import ForgotPasswordFlow from "../forgotPassword/ForgotPasswordFlow";

type AuthCardProps = {
  onOpenRegister?: () => void;
  isMobile?: boolean;
  compact?: boolean;
  density?: number;
};

const AuthCard = ({
  onOpenRegister,
  isMobile = false,
  compact = false,
  density = 1,
}: AuthCardProps) => {
  const form = useLoginForm();
  const metrics = authCardMetrics(isMobile, compact, density);

  return (
    <View
      style={[
        styles.card,
        isMobile ? styles.cardMobile : compact ? styles.cardDesktopCompact : styles.cardDesktop,
        {
          borderRadius: metrics.borderRadius,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingTop: metrics.paddingTop,
          paddingBottom: metrics.paddingBottom,
        },
      ]}
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
        <Text style={styles.forgotText}>Forgot Password?</Text>
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

      <ForgotPasswordFlow
        visible={form.showForgotPassword}
        onClose={form.closeForgotPassword}
        initialEmail={form.email}
      />
    </View>
  );
};

export default AuthCard;
