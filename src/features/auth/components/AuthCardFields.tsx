import type { RefObject } from "react";
import { View, type TextInput } from "react-native";
import InlineAlert from "@/components/feedback/InlineAlert";
import AuthField from "@/components/landing/AuthField";
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
        label="Email or phone number"
        icon="mail-outline"
        placeholder="Enter your email or phone"
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
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        error={form.passwordError}
      />

      {form.formError ? (
        <InlineAlert scheme="light" title={form.formError.title} message={form.formError.message} />
      ) : null}
    </View>
  );
};

export default AuthCardFields;
