import DateInput from "../../components/DateInput";
import PhoneInput from "../../components/PhoneInput";
import RegistrationInput from "../../components/RegistrationInput";
import SegmentedInput from "../../components/SegmentedInput";
import SelectInput from "../../components/SelectInput";
import { CIVIL_STATUS_OPTIONS, SEX_OPTIONS } from "../../registrationOptions";
import type { StepProps } from "../stepLayout";

export const useIdentityContactFields = ({ form, layout }: StepProps) => {
  const { values, errors, setField, blurField } = form;
  const { inputHeight } = layout;

  const dateOfBirth = (
    <DateInput
      label="Date of Birth"
      required
      value={values.dateOfBirth}
      onChange={(date) => setField("dateOfBirth", date)}
      placeholder="Select your date of birth"
      error={errors.dateOfBirth}
      height={inputHeight}
    />
  );

  const sex = (
    <SegmentedInput
      label="Sex"
      required
      value={values.sex}
      options={SEX_OPTIONS}
      onChange={(value) => setField("sex", value)}
      error={errors.sex}
      height={inputHeight}
    />
  );

  const civilStatus = (
    <SelectInput
      label="Civil Status"
      optional
      icon="users"
      value={values.civilStatus}
      options={CIVIL_STATUS_OPTIONS}
      onChange={(value) => setField("civilStatus", value)}
      placeholder="Select civil status"
      error={errors.civilStatus}
      height={inputHeight}
    />
  );

  const contactNumber = (
    <PhoneInput
      label="Contact Number"
      required
      value={values.contactNumber}
      onChangeText={(text) => setField("contactNumber", text)}
      onBlur={() => blurField("contactNumber")}
      placeholder="09XX XXX XXXX"
      error={errors.contactNumber}
      height={inputHeight}
    />
  );

  const email = (
    <RegistrationInput
      label="Email Address"
      required
      icon="mail"
      value={values.email}
      onChangeText={(text) => setField("email", text)}
      onBlur={() => blurField("email")}
      placeholder="you@example.com"
      helper="We send your verification code here."
      error={errors.email}
      height={inputHeight}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      textContentType="emailAddress"
    />
  );

  return { dateOfBirth, sex, civilStatus, contactNumber, email };
};
