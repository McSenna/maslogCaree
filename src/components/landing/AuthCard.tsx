import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
}

/**
 * Premium white authentication card for MaslogCare.
 *
 * Implements the modern healthcare authentication design for both Desktop and Mobile views.
 * Preserves the existing `useAuth().login()` call, role-based redirects,
 * loading indicators, and form validation.
 */
export default function AuthCard({ onOpenRegister, isMobile = false }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email address or phone number.");
      return;
    }
    if (!password) {
      Alert.alert("Validation", "Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success && result.role) {
        router.replace(getDashboardPath(result.role) as any);
      } else {
        Alert.alert(
          "Login Failed",
          result.error ?? "Invalid credentials. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be available soon."
    );
  };

  return (
    <View style={[styles.card, isMobile ? styles.cardMobile : styles.cardDesktop]}>
      {/* Heading + Subtitle */}
      <View style={isMobile ? styles.headerWrapperMobile : styles.headerWrapperDesktop}>
        <AuthHeader centered={isMobile} />
      </View>

      {/* Inputs */}
      <View style={styles.form}>
        <AuthInput
          icon="mail-outline"
          placeholder="Email address or phone number"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          accessibilityLabel="Email address or phone number"
        />

        <AuthInput
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
        />
      </View>

      {/* Log In button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log In"
        onPress={handleLogin}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.loginButton,
          (pressed || isSubmitting) && styles.buttonPressed,
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
        style={styles.forgotContainer}
      >
        <Text style={styles.forgotText}>Forgotten password?</Text>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerWrapper}>
        <AuthDivider />
      </View>

      {/* Create New Account button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create New Account"
        onPress={onOpenRegister}
        style={({ pressed }) => [
          styles.createButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.createButtonText}>Create New Account</Text>
      </Pressable>

      {/* Security notice */}
      <View style={styles.securityWrapper}>
        <SecurityNotice />
      </View>
    </View>
  );
}

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
    paddingHorizontal: 38,
    paddingTop: 38,
    paddingBottom: 32,
  },
  cardMobile: {
    width: "100%",
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
  },

  headerWrapperDesktop: {
    marginBottom: 24,
  },
  headerWrapperMobile: {
    marginBottom: 24,
  },

  form: {
    gap: 14,
    marginBottom: 18,
  },

  loginButton: {
    height: 52,
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
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
    marginBottom: 20,
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

  dividerWrapper: {
    marginBottom: 20,
  },

  createButton: {
    height: 52,
    backgroundColor: LANDING_COLORS.green,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
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
