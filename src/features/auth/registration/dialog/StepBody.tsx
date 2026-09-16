import type { useResidentRegistration } from "../useResidentRegistration";
import AccountStep from "../steps/AccountStep";
import AddressStep from "../steps/AddressStep";
import IdentityStep from "../steps/IdentityStep";
import PersonalStep from "../steps/PersonalStep";
import ReviewStep from "../steps/ReviewStep";
import type { StepLayout } from "../steps/stepLayout";

type Props = {
  form: ReturnType<typeof useResidentRegistration>;
  layout: StepLayout;
};

const StepBody = ({ form, layout }: Props) => {
  switch (form.step.key) {
    case "personal":
      return <PersonalStep form={form} layout={layout} />;
    case "identity":
      return <IdentityStep form={form} layout={layout} />;
    case "address":
      return <AddressStep form={form} layout={layout} />;
    case "account":
      return <AccountStep form={form} layout={layout} />;
    case "review":
      return <ReviewStep form={form} layout={layout} />;
  }
};

export default StepBody;
