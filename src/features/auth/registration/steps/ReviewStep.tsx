import { View } from "react-native";
import ConsentCheckbox from "../components/ConsentCheckbox";
import FormError from "../components/FormError";
import ReviewSection from "../components/ReviewSection";
import StepHeading from "../components/StepHeading";
import { STEP_SUBTITLES } from "../registrationOptions";
import { summarizeRegistration } from "../registrationSummary";
import type { StepProps } from "./stepLayout";

const ReviewStep = ({ form }: StepProps) => {
  const summary = summarizeRegistration(form.values);

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title="Review & Confirm" subtitle={STEP_SUBTITLES.review} />

      <FormError message={form.submitError} />

      <ReviewSection
        title="Personal Information"
        icon="user"
        editLabel="Edit personal information"
        onEdit={() => form.goToStep("personal")}
        entries={[
          { label: "Name", value: summary.fullName },
          { label: "Date of Birth", value: summary.dateOfBirth },
          { label: "Sex", value: summary.sex },
          { label: "Civil Status", value: summary.civilStatus },
          { label: "Contact Number", value: summary.contactNumber },
          { label: "Email", value: summary.email },
        ]}
      />

      <ReviewSection
        title="Identity Verification"
        icon="credit-card"
        editLabel="Edit identity verification"
        onEdit={() => form.goToStep("identity")}
        entries={[
          { label: "ID Type", value: summary.idType },
          { label: "ID Number", value: summary.maskedIdNumber },
          { label: "Uploaded Document", value: summary.idDocumentLabel },
        ]}
      />

      <ReviewSection
        title="Address"
        icon="map-pin"
        editLabel="Edit address"
        onEdit={() => form.goToStep("address")}
        entries={[{ label: "Complete Address", value: summary.address }]}
      />

      <ReviewSection
        title="Account"
        icon="lock"
        editLabel="Edit account details"
        onEdit={() => form.goToStep("account")}
        entries={[{ label: "Password", value: "••••••••" }]}
      />

      <ConsentCheckbox checked={form.agreedToTerms} onChange={form.setAgreedToTerms} />
    </View>
  );
};

export default ReviewStep;
