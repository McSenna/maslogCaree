import type { RefObject } from "react";
import { View, type TextInput } from "react-native";
import AuthField from "@/components/landing/AuthField";
import { PASSWORD_MAX_LENGTH } from "../forgotPassword/passwordRules";
import type { useLoginForm } from "../hooks/useLoginForm";
import type { AuthCardMetrics } from "./authCardMetricPresets";
import { authCardStyles as styles } from "./authCardStyles";

type AuthCardFieldsProps = {
  form: ReturnType<typeof useLoginForm>;
  metrics: AuthCardMetrics;
  emailRef: RefObject<TextInput | null>;
  passwordRef: RefObject<TextInput | null>;
  onSubmit: () => void;
};

const AuthCardFields = ({ form, metrics, emailRef, passwordRef, onSubmit }: AuthCardFieldsProps) => {
  const fieldProps = {
    labelSize: metrics.labelSize,
    labelGap: metrics.labelGap,
    height: metrics.fieldHeight,
    fontSize: metrics.fieldFontSize,
    disabled: form.isSubmitting,
  };

  return (
    <View style={[styles.form, { gap: metrics.fieldGap, marginBottom: metrics.formGap }]}>
      <AuthField
        {...fieldProps}
        inputRef={emailRef}
        label="Email address"
        icon="mail-outline"
        placeholder="Enter your email address"
        value={form.email}
        onChangeText={form.setEmail}
        keyboardType="email-address"
        autoComplete="username"
        textContentType="username"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={form.emailError}
      />

      <AuthField
        {...fieldProps}
        inputRef={passwordRef}
        label="Password"
        icon="lock-closed-outline"
        placeholder="Enter your password"
        value={form.password}
        onChangeText={form.setPassword}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        maxLength={PASSWORD_MAX_LENGTH}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        error={form.passwordError}
      />
    </View>
  );
};

export default AuthCardFields;
