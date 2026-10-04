import { View } from "react-native";

import FormError from "@/features/auth/registration/components/FormError";
import ReviewSection from "@/features/auth/registration/components/ReviewSection";
import StepHeading from "@/features/auth/registration/components/StepHeading";

import { capitalize, formatBirthDate, masterFullName } from "../../masterResidentForm";
import { MASTER_STEPS } from "../../masterResidentSteps";
import type { EditorStepProps } from "./editorLayout";

const STEP = MASTER_STEPS[3];

const MasterReviewStep = ({ form }: EditorStepProps) => {
  const { values, goToStep, isEditing } = form;
  const recordId = values.masterResidentId?.trim();

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title={STEP.title} subtitle={STEP.subtitle} />
      <FormError message={form.submitError} />

      <ReviewSection
        title="Resident Name"
        icon="user"
        editLabel="Edit the resident name"
        onEdit={() => goToStep(0)}
        entries={[{ label: "Full Name", value: masterFullName(values) }]}
      />
      <ReviewSection
        title="Personal Details"
        icon="calendar"
        editLabel="Edit the personal details"
        onEdit={() => goToStep(1)}
        entries={[
          { label: "Date of Birth", value: values.dateOfBirth ? formatBirthDate(values.dateOfBirth) : "" },
          { label: "Sex", value: capitalize(values.sex) },
          { label: "Civil Status", value: capitalize(values.civilStatus) },
        ]}
      />
      <ReviewSection
        title="Address and Record ID"
        icon="map-pin"
        editLabel="Edit the address and record ID"
        onEdit={() => goToStep(2)}
        entries={[
          { label: "Purok and Street", value: values.address },
          { label: "Barangay", value: values.barangay },
          { label: "Record ID", value: recordId || (isEditing ? "" : "Generated when saved") },
        ]}
      />
    </View>
  );
};

export default MasterReviewStep;
