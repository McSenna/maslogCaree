import { useRef } from "react";
import { View, type TextInput } from "react-native";

import SupportAttachmentPicker from "./SupportAttachmentPicker";
import SupportCategorySelect from "./SupportCategorySelect";
import SupportDescriptionInput from "./SupportDescriptionInput";
import SupportTextField from "./SupportTextField";
import { SUPPORT_LIMITS, SUPPORT_PLACEHOLDERS } from "../constants/support.constants";
import type { useSupportForm } from "../hooks/useSupportForm";

type SupportFormProps = {
  form: ReturnType<typeof useSupportForm>;
};

const SupportForm = ({ form }: SupportFormProps) => {
  const descriptionRef = useRef<TextInput>(null);
  const { values, errors, submitting, setField, attachments } = form;

  return (
    <View style={{ gap: 18 }}>
      <SupportTextField label="Full Name" value={values.fullName} readOnly />
      <SupportTextField label="Email Address" value={values.contactEmail} readOnly />

      <SupportTextField
        label="Contact Number"
        value={values.contactNumber}
        onChangeText={(value) => setField("contactNumber", value)}
        placeholder="09XX XXX XXXX"
        keyboardType="phone-pad"
        maxLength={20}
        error={errors.contactNumber}
      />

      <SupportCategorySelect
        value={values.category}
        onChange={(value) => setField("category", value)}
        error={errors.category}
      />

      <SupportTextField
        label="Subject"
        value={values.subject}
        onChangeText={(value) => setField("subject", value)}
        placeholder={SUPPORT_PLACEHOLDERS.subject}
        maxLength={SUPPORT_LIMITS.subjectMax}
        required
        error={errors.subject}
        returnKeyType="next"
        onSubmitEditing={() => descriptionRef.current?.focus()}
      />

      <SupportDescriptionInput
        inputRef={descriptionRef}
        value={values.description}
        onChangeText={(value) => setField("description", value)}
        error={errors.description}
      />

      <SupportAttachmentPicker
        attachments={attachments.attachments}
        error={errors.attachments ?? attachments.error}
        disabled={submitting}
        onAdd={attachments.addAttachment}
        onRemove={attachments.removeAttachment}
      />
    </View>
  );
};

export default SupportForm;
