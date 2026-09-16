import type { RegistrationController } from "../useResidentRegistration";

export type StepLayout = {
  inputHeight: number;
  twoColumn: boolean;
};

export type StepProps = {
  form: RegistrationController;
  layout: StepLayout;
};
