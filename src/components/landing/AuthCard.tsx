import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { LANDING_COLORS } from "@/config/landingAssets";

import AuthHeader from "./AuthHeader";
import AuthInput from "./AuthInput";
import AuthDivider from "./AuthDivider";
import SecurityNotice from "./SecurityNotice";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
import PlatformAccessModal from "@/components/ui/PlatformAccessModal";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

interface AuthCardProps {
  /** Called when user taps "Create New Account" */
  onOpenRegister?: () => void;
  /** Whether to use mobile-optimized layout */
  isMobile?: boolean;
  /** Reduced desktop scale for short/narrow viewports (e.g. 1366×768). */
  compact?: boolean;
}

/**
 * Premium white authentication card for MaslogCare.
 *
 * Implements the modern healthcare authentication design for both Desktop and Mobile views.
 * Preserves the existing `useAuth().login()` call, role-based redirects,
 * loading indicators, and form validation.
 */
export default function AuthCard({
  onOpenRegister,
  isMobile = false,
  compact = false,
}: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pressedButton, setPressedButton] = useState<"login" | "create" | null>(
    null
  );
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!email.trim()) {
      showAlert("Validation", "Please enter your email address or phone number.");
      return;
    }
    if (!password) {
      showAlert("Validation", "Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success && result.role) {
        router.replace(getDashboardPath(result.role) as any);
        return;
      }

      // Right credentials, wrong client. This is a policy outcome rather than
      // a failure, so it gets the MaslogCare dialog explaining where to go
      // instead of a "Login Failed" alert — and the user stays on this page,
      // since no session was created to navigate away with.
      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPassword("");
        setShowPlatformNotice(true);
        return;
      }

      showAlert("Login Failed", result.error ?? "Invalid email or password.");
    } catch (error: unknown) {
      // login() already returns failures in `result`; reaching here means an
      // unexpected client-side fault rather than a rejected credential.
      showAlert(
        "Login Failed",
        getApiErrorMessage(error, "An unexpected error occurred. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    showAlert(
      "Forgot Password",
      "Password reset functionality will be available soon."
    );
  };

  // Vertical rhythm differs between the approved desktop and mobile designs:
  // the desktop card is airy, the mobile card compact so it fits a 360×800
  // screen without clipping the Create New Account button.
  const m = isMobile
    ? MOBILE_METRICS
    : compact
      ? COMPACT_DESKTOP_METRICS
      : DESKTOP_METRICS;

  return (
    <View
      style={[
        styles.card,
        isMobile
          ? styles.cardMobile
          : compact
            ? styles.cardDesktopCompact
            : styles.cardDesktop,
      ]}
    >
      {/* Heading + Subtitle */}
      <View style={{ marginBottom: m.headerGap }}>
        <AuthHeader centered={isMobile} compact={isMobile || compact} />
      </View>

      {/* Inputs */}
      <View style={[styles.form, { gap: m.fieldGap, marginBottom: m.formGap }]}>
        <AuthInput
          icon="mail-outline"
          placeholder="Email address or phone number"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          accessibilityLabel="Email address or phone number"
          height={m.fieldHeight}
          fontSize={m.fieldFontSize}
        />

        <AuthInput
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
          height={m.fieldHeight}
          fontSize={m.fieldFontSize}
        />
      </View>

      {/* Log In button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log In"
        onPress={handleLogin}
        disabled={isSubmitting}
        onPressIn={() => setPressedButton("login")}
        onPressOut={() => setPressedButton(null)}
        android_ripple={ANDROID_RIPPLE}
        style={[
          styles.loginButton,
          {
            height: m.buttonHeight,
            marginBottom: m.afterLoginGap,
            backgroundColor: LANDING_COLORS.primaryBlue,
          },
          (pressedButton === "login" || isSubmitting) && styles.buttonPressed,
        ]}
      >
        {isSubmitting ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Logging In...</Text>
          </View>
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </Pressable>

      {/* Forgotten password link */}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Forgotten password"
        onPress={handleForgotPassword}
        style={[styles.forgotContainer, { marginBottom: m.afterForgotGap }]}
      >
        <Text style={styles.forgotText}>Forgotten password?</Text>
      </Pressable>

      {/* Divider */}
      <View style={{ marginBottom: m.afterDividerGap }}>
        <AuthDivider />
      </View>

      {/* Create New Account button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create New Account"
        onPress={onOpenRegister}
        onPressIn={() => setPressedButton("create")}
        onPressOut={() => setPressedButton(null)}
        android_ripple={ANDROID_RIPPLE}
        style={[
          styles.createButton,
          {
            height: m.buttonHeight,
            marginBottom: m.afterCreateGap,
            backgroundColor: LANDING_COLORS.green,
          },
          pressedButton === "create" && styles.buttonPressed,
        ]}
      >
        <Text style={styles.createButtonText}>Create New Account</Text>
      </Pressable>

      {/* Security notice */}
      <View style={styles.securityWrapper}>
        <SecurityNotice />
      </View>

      <PlatformAccessModal
        visible={showPlatformNotice}
        onClose={() => setShowPlatformNotice(false)}
      />
    </View>
  );
}

/**
 * Pressable's function-style form (`style={({ pressed }) => ...}`) rendered as
 * an unstyled view on Android in Expo Go — the buttons lost their background
 * and height and became invisible white-on-white text. Plain array styles with
 * explicit press state behave identically on every platform, so the primary
 * actions are never at the mercy of that callback.
 */
const ANDROID_RIPPLE = { color: "rgba(255, 255, 255, 0.24)" } as const;

/** Airy rhythm for the 1920×1080 desktop card. */
const DESKTOP_METRICS = {
  headerGap: 34,
  fieldHeight: 60,
  fieldGap: 18,
  formGap: 26,
  buttonHeight: 56,
  afterLoginGap: 20,
  afterForgotGap: 28,
  afterDividerGap: 28,
  afterCreateGap: 24,
  fieldFontSize: 16,
} as const;

/** Reduced desktop rhythm for 1366×768-class viewports. */
const COMPACT_DESKTOP_METRICS = {
  headerGap: 24,
  fieldHeight: 54,
  fieldGap: 14,
  formGap: 20,
  buttonHeight: 52,
  afterLoginGap: 14,
  afterForgotGap: 20,
  afterDividerGap: 20,
  afterCreateGap: 18,
  fieldFontSize: 15,
} as const;

/** Compact rhythm for Android, within the 48–52px control guidance. */
const MOBILE_METRICS = {
  headerGap: 20,
  fieldHeight: 52,
  fieldGap: 14,
  formGap: 18,
  buttonHeight: 50,
  afterLoginGap: 12,
  afterForgotGap: 16,
  afterDividerGap: 16,
  afterCreateGap: 16,
  fieldFontSize: 15,
} as const;

const styles = StyleSheet.create({
  card: {
    backgroundColor: LANDING_COLORS.white,
    borderWidth: 1,
    borderColor: "#E2EAF4",
    ...Platform.select({
      web: {
        boxShadow: "0px 14px 40px rgba(8, 21, 47, 0.08)",
      } as any,
      default: {
        elevation: 5,
        shadowColor: "#08152F",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
      },
    }),
  },
  cardDesktop: {
    width: "100%",
    maxWidth: 446,
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingTop: 54,
    paddingBottom: 44,
  },
  cardDesktopCompact: {
    width: "100%",
    maxWidth: 404,
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingTop: 34,
    paddingBottom: 30,
  },
  cardMobile: {
    width: "100%",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
  },

  form: {
    flexDirection: "column",
  },

  loginButton: {
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease",
      } as any,
    }),
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loginButtonText: {
    color: LANDING_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  forgotContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    ...Platform.select({
      web: {
        cursor: "pointer",
      } as any,
    }),
  },
  forgotText: {
    color: LANDING_COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },

  createButton: {
    backgroundColor: LANDING_COLORS.green,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease",
      } as any,
    }),
  },
  createButtonText: {
    color: LANDING_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },

  securityWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
