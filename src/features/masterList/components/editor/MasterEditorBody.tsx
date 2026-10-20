import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import DateInput from "@/features/auth/registration/components/DateInput";
import FormError from "@/features/auth/registration/components/FormError";
import FormRow from "@/features/auth/registration/components/FormRow";
import RegistrationInput from "@/features/auth/registration/components/RegistrationInput";
import SegmentedInput from "@/features/auth/registration/components/SegmentedInput";
import SelectInput from "@/features/auth/registration/components/SelectInput";
import StepHeading from "@/features/auth/registration/components/StepHeading";
import { REG_COLORS } from "@/features/auth/registration/registrationTheme";

import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";
import {
  CIVIL_STATUS_CHOICES,
  PUROK_CHOICES,
  SEX_CHOICES,
  type MasterFormField,
} from "../../masterResidentForm";
import { MASTER_ROLE_CHOICES } from "../../masterResidentRoles";
import { orderedMasterErrors } from "../../masterResidentSections";
import MasterEditorField from "./MasterEditorField";
import MasterPurokDropdown from "./MasterPurokDropdown";

type Props = {
  form: MasterResidentEditorState;
  inputHeight: number;
  twoColumn: boolean;
  registerField: (field: MasterFormField, node: View | null) => void;
  onFieldPress: (field: MasterFormField) => void;
};

const MasterEditorBody = ({
  form,
  inputHeight,
  twoColumn,
  registerField,
  onFieldPress,
}: Props) => {
  const { values, errors, setField, submitting } = form;
  const fieldErrors = orderedMasterErrors(errors);
  // Older records can contain a street address. Keep it visible and unchanged
  // unless the user explicitly selects a purok from the new list.
  const purokOptions =
    !values.address ||
    PUROK_CHOICES.some((option) => option.value === values.address)
      ? PUROK_CHOICES
      : [{ value: values.address, label: values.address }, ...PUROK_CHOICES];
  const field = (
    name: MasterFormField,
    children: ReactNode,
    required = false,
  ) => (
    <MasterEditorField
      field={name}
      error={errors[name]}
      required={required}
      registerField={registerField}
    >
      {children}
    </MasterEditorField>
  );
  const sectionStyle = {
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: REG_COLORS.border,
    paddingTop: 24,
  };

  return (
    <View style={{ gap: 28 }}>
      {form.submitError || fieldErrors.length ? (
        <View style={{ gap: 4 }}>
          <FormError
            message={
              form.submitError ||
              "Review the highlighted details before saving."
            }
          />
          {fieldErrors.map(({ field: name, label, message }) => (
            <Pressable
              key={name}
              onPress={() => onFieldPress(name)}
              accessibilityRole="button"
              accessibilityLabel={`Fix ${label}: ${message}`}
              style={{
                minHeight: 44,
                justifyContent: "center",
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 19,
                  color: REG_COLORS.error,
                  textDecorationLine: "underline",
                }}
              >
                {label}: {message}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={{ gap: 18 }}>
        <StepHeading
          title="Personal Information"
          subtitle="Use the details shown in the official barangay registry."
        />
        <FormRow twoColumn={twoColumn}>
          {field(
            "firstName",
            <RegistrationInput
              label="First Name"
              required
              icon="user"
              value={values.firstName}
              onChangeText={(v) => setField("firstName", v)}
              placeholder="As written in the registry"
              error={errors.firstName}
              disabled={submitting}
              height={inputHeight}
              autoCapitalize="words"
              maxLength={50}
            />,
            true,
          )}
          {field(
            "middleName",
            <RegistrationInput
              label="Middle Name"
              optional
              icon="user"
              value={values.middleName}
              onChangeText={(v) => setField("middleName", v)}
              placeholder="Leave blank if none"
              error={errors.middleName}
              disabled={submitting}
              height={inputHeight}
              autoCapitalize="words"
              maxLength={50}
            />,
          )}
        </FormRow>
        <FormRow twoColumn={twoColumn}>
          {field(
            "lastName",
            <RegistrationInput
              label="Last Name"
              required
              icon="user"
              value={values.lastName}
              onChangeText={(v) => setField("lastName", v)}
              placeholder="As written in the registry"
              error={errors.lastName}
              disabled={submitting}
              height={inputHeight}
              autoCapitalize="words"
              maxLength={50}
            />,
            true,
          )}
          {field(
            "suffix",
            <RegistrationInput
              label="Suffix"
              optional
              icon="award"
              value={values.suffix}
              onChangeText={(v) => setField("suffix", v)}
              placeholder="e.g. Jr. or III"
              error={errors.suffix}
              disabled={submitting}
              height={inputHeight}
              maxLength={20}
            />,
          )}
        </FormRow>
        <FormRow twoColumn={twoColumn}>
          {field(
            "dateOfBirth",
            <DateInput
              label="Date of Birth"
              required
              value={values.dateOfBirth}
              onChange={(v) => setField("dateOfBirth", v)}
              placeholder="Select the birth date"
              error={errors.dateOfBirth}
              height={inputHeight}
            />,
            true,
          )}
          {field(
            "sex",
            <SegmentedInput
              label="Sex"
              required
              value={values.sex}
              options={SEX_CHOICES}
              onChange={(v) => setField("sex", v)}
              error={errors.sex}
              height={inputHeight}
            />,
            true,
          )}
        </FormRow>
        <FormRow twoColumn={twoColumn}>
          {field(
            "civilStatus",
            <SelectInput
              label="Civil Status"
              required
              icon="users"
              value={values.civilStatus}
              options={CIVIL_STATUS_CHOICES}
              onChange={(v) => setField("civilStatus", v)}
              placeholder="Select civil status"
              error={errors.civilStatus}
              disabled={submitting}
              height={inputHeight}
            />,
            true,
          )}
          {field(
            "role",
            <SelectInput
              label="Role"
              required
              icon="user-check"
              value={values.role}
              options={MASTER_ROLE_CHOICES}
              onChange={(value) => setField("role", value)}
              placeholder="Select a role"
              helper="BHW means Barangay Health Worker."
              error={errors.role}
              disabled={submitting}
              height={inputHeight}
            />,
            true,
          )}
        </FormRow>
      </View>
      <View style={sectionStyle}>
        <StepHeading
          title="Address"
          subtitle="Enter where the resident lives in the barangay."
        />
        <FormRow twoColumn={twoColumn}>
          {field(
            "address",
            <MasterPurokDropdown
              value={values.address}
              options={purokOptions}
              onChange={(v) => setField("address", v)}
              error={errors.address}
              disabled={submitting}
              height={inputHeight}
            />,
            true,
          )}
          {field(
            "barangay",
            <RegistrationInput
              label="Barangay"
              required
              icon="map-pin"
              value={values.barangay}
              onChangeText={(v) => setField("barangay", v)}
              error={errors.barangay}
              disabled={submitting}
              height={inputHeight}
              autoCapitalize="words"
              maxLength={100}
            />,
            true,
          )}
        </FormRow>
      </View>
    </View>
  );
};

export default MasterEditorBody;
