import { useId } from "react";
import { View } from "react-native";

import PasswordField from "@/components/forms/PasswordField";
import PasswordRequirements from "@/features/auth/forgotPassword/components/PasswordRequirements";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";

import type { ChangePasswordLayout } from "./changePassword.types";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings";
import { passwordRequirementRules } from "./changePasswordValidation";
import { ChangePasswordNotice } from "./ChangePasswordNotice";
import type { ChangePasswordFlow } from "./useChangePasswordFlow";

type ChangePasswordFormProps = {
  flow: ChangePasswordFlow;
  layout: ChangePasswordLayout;
};

/** Matches the mockup's label column (about a third of an 800px card). */
const LABEL_COLUMN = 220;

const toggleLabels = (label: string) => ({ show: S.toggle.show(label), hide: S.toggle.hide(label) });

/** The banner and the three fields. Presentational: every decision comes from the flow. */
export const ChangePasswordForm = ({ flow, layout }: ChangePasswordFormProps) => {
  const colors = useThemeColors();
  const requirementsId = useId();
  const { form, banner, isSubmitting, submit } = flow;
  const { values, errors, refs } = form;
  const rowProps = layout === "row" ? ({ labelPosition: "start", labelWidth: LABEL_COLUMN } as const) : {};

  return (
    <View style={{ gap: layout === "row" ? SPACING.xl : SPACING.lg }}>
      {banner ? (
        <ChangePasswordNotice
          tone={banner.tone}
          message={banner.message}
          retryLabel={banner.retry ? S.retry : undefined}
          onRetry={banner.retry ? submit : undefined}
          retrying={isSubmitting}
        />
      ) : null}

      <PasswordField
        {...rowProps}
        purpose="current"
        inputRef={refs.currentPassword}
        initialFocus
        label={S.fields.currentPassword.label}
        placeholder={S.fields.currentPassword.placeholder}
        toggleLabels={toggleLabels(S.fields.currentPassword.label)}
        value={values.currentPassword}
        onChangeText={(text) => form.setValue("currentPassword", text)}
        onBlur={() => form.blurField("currentPassword")}
        error={errors.currentPassword}
        returnKeyType="next"
        onSubmitEditing={() => form.focusField("newPassword")}
        disabled={isSubmitting}
      />

      <PasswordField
        {...rowProps}
        purpose="new"
        inputRef={refs.newPassword}
        label={S.fields.newPassword.label}
        placeholder={S.fields.newPassword.placeholder}
        toggleLabels={toggleLabels(S.fields.newPassword.label)}
        value={values.newPassword}
        onChangeText={(text) => form.setValue("newPassword", text)}
        onBlur={() => form.blurField("newPassword")}
        error={errors.newPassword}
        returnKeyType="next"
        onSubmitEditing={() => form.focusField("confirmPassword")}
        disabled={isSubmitting}
        describedBy={requirementsId}
        below={
          <PasswordRequirements
            nativeID={requirementsId}
            value={values.newPassword}
            rules={passwordRequirementRules(values.currentPassword)}
            title={S.requirements.title}
            stateLabels={{ met: S.requirements.met, notMet: S.requirements.notMet }}
            colors={{ met: colors.success.fg, unmetIcon: colors.muted, unmetText: colors.muted, heading: colors.body, error: colors.danger.fg }}
            // The field's error points here, so the rules still unmet turn red with a cross.
            highlightUnmet={Boolean(errors.newPassword) && errors.newPassword !== S.errors.sameAsCurrent}
          />
        }
      />

      <PasswordField
        {...rowProps}
        purpose="new"
        inputRef={refs.confirmPassword}
        label={S.fields.confirmPassword.label}
        placeholder={S.fields.confirmPassword.placeholder}
        toggleLabels={toggleLabels(S.fields.confirmPassword.label)}
        value={values.confirmPassword}
        onChangeText={(text) => form.setValue("confirmPassword", text)}
        onBlur={() => form.blurField("confirmPassword")}
        error={errors.confirmPassword}
        returnKeyType="done"
        onSubmitEditing={submit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default ChangePasswordForm;
