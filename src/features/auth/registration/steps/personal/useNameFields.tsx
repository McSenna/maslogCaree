import RegistrationInput from "../../components/RegistrationInput";
import type { StepProps } from "../stepLayout";

export const useNameFields = ({ form, layout }: StepProps) => {
  const { values, errors, setField, blurField } = form;
  const { inputHeight } = layout;

  const firstName = (
    <RegistrationInput
      label="First Name"
      required
      icon="user"
      value={values.firstName}
      onChangeText={(text) => setField("firstName", text)}
      onBlur={() => blurField("firstName")}
      placeholder="Enter your first name"
      error={errors.firstName}
      height={inputHeight}
      autoCapitalize="words"
      autoComplete="given-name"
    />
  );

  const middleName = (
    <RegistrationInput
      label="Middle Name"
      optional
      icon="user"
      value={values.middleName}
      onChangeText={(text) => setField("middleName", text)}
      onBlur={() => blurField("middleName")}
      placeholder="Enter your middle name"
      error={errors.middleName}
      height={inputHeight}
      autoCapitalize="words"
      autoComplete="additional-name"
    />
  );

  const surname = (
    <RegistrationInput
      label="Surname"
      required
      icon="user"
      value={values.surname}
      onChangeText={(text) => setField("surname", text)}
      onBlur={() => blurField("surname")}
      placeholder="Enter your surname"
      error={errors.surname}
      height={inputHeight}
      autoCapitalize="words"
      autoComplete="family-name"
    />
  );

  const suffix = (
    <RegistrationInput
      label="Suffix"
      optional
      icon="user"
      value={values.suffix}
      onChangeText={(text) => setField("suffix", text)}
      onBlur={() => blurField("suffix")}
      placeholder="Jr., Sr., III"
      helper="Leave blank if you do not have one."
      error={errors.suffix}
      height={inputHeight}
      autoCapitalize="words"
      autoComplete="name-suffix"
      maxLength={20}
    />
  );

  return { firstName, middleName, surname, suffix };
};
