import { useRef } from "react";
import { Text, View, type TextInput } from "react-native";

import TextField from "@/components/forms/TextField";
import SegmentedControl from "@/components/dashboard/kit/SegmentedControl";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { ANNOUNCEMENT_AUDIENCES, type Audience } from "../../announcement.types";
import { ANNOUNCEMENT_LIMITS } from "../../announcementRules";
import type { AnnouncementFormState } from "../../hooks/useAnnouncementForm";
import AnnouncementDateTimeFields from "./AnnouncementDateTimeFields";
import AnnouncementEndDateField from "./AnnouncementEndDateField";
import { formIntro } from "./formCopy";

type AnnouncementFormProps = {
  form: AnnouncementFormState;
  compact: boolean;
};

const AUDIENCE_OPTIONS = ANNOUNCEMENT_AUDIENCES.map((value) => ({ value, label: value }));

const POSTING_OPTIONS = [
  { value: "post", label: "Post now" },
  { value: "draft", label: "Save as draft" },
] as const;

const FormSection = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 14, fontWeight: "600", color: palette.heading }}>
        {label}
      </Text>
      {children}
    </View>
  );
};

const AnnouncementForm = ({ form, compact }: AnnouncementFormProps) => {
  const palette = useResidentDialogPalette();
  const controlPalette = useAdminSurfacePalette();
  const messageRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const { values, errors, submitting, setField } = form;
  const L = ANNOUNCEMENT_LIMITS;

  return (
    <View style={{ gap: compact ? 20 : 24 }}>
      <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.body }}>
        {formIntro(values, form.isEditing, form.canChooseDraft)}
      </Text>

      <FormSection label="What">
        <TextField
          label="Title"
          required
          value={values.title}
          onChangeText={(text) => setField("title", text)}
          placeholder="e.g. Free vaccination drive"
          maxLength={L.titleMax}
          autoCapitalize="sentences"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => messageRef.current?.focus()}
          disabled={submitting}
          error={errors.title}
        />
        <TextField
          inputRef={messageRef}
          label="Message"
          required
          multiline
          value={values.message}
          onChangeText={(text) => setField("message", text)}
          placeholder="What should residents know or bring?"
          maxLength={L.messageMax}
          autoCapitalize="sentences"
          disabled={submitting}
          error={errors.message}
          helper={`${values.message.length} / ${L.messageMax}`}
        />
      </FormSection>

      <FormSection label="Who">
        <SegmentedControl<Audience>
          palette={controlPalette}
          label="Audience"
          value={values.audience}
          options={AUDIENCE_OPTIONS}
          onChange={(audience) => setField("audience", audience)}
          fill={compact}
        />
      </FormSection>

      <FormSection label="When">
        <AnnouncementDateTimeFields
          date={values.date}
          time={values.time}
          onChangeDate={(value) => setField("date", value)}
          onChangeTime={(value) => setField("time", value)}
          dateError={errors.date}
          timeError={errors.time}
          disabled={submitting}
          stacked={compact}
        />
        <AnnouncementEndDateField
          value={values.endDate}
          eventDate={values.date}
          onChange={(value) => setField("endDate", value)}
          error={errors.endDate}
          disabled={submitting}
        />
      </FormSection>

      <FormSection label="Where">
        <TextField
          inputRef={locationRef}
          label="Location or venue"
          required
          leftIcon="map-pin"
          value={values.location}
          onChangeText={(text) => setField("location", text)}
          placeholder="e.g. Barangay Maslog Health Center"
          maxLength={L.locationMax}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => void form.submit()}
          disabled={submitting}
          error={errors.location}
        />
      </FormSection>

      {form.canChooseDraft ? (
        <FormSection label="Posting">
          <SegmentedControl
            palette={controlPalette}
            label="Posting"
            value={values.isDraft ? "draft" : "post"}
            options={POSTING_OPTIONS}
            onChange={(choice) => setField("isDraft", choice === "draft")}
            fill={compact}
          />
        </FormSection>
      ) : null}
    </View>
  );
};

export default AnnouncementForm;
